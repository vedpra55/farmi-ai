"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import {
  Loader2,
  RefreshCw,
  PlusCircle,
  History as HistoryIcon,
  ChevronLeft,
} from "lucide-react";
import { ImageUpload } from "./_components/ImageUpload";
import { AnalysisResult } from "./_components/AnalysisResult";
import { DiseaseHistory, DiseaseScan } from "./_components/DiseaseHistory";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function DiseasePage() {
  const t = useTranslations("Disease");
  const [activeTab, setActiveTab] = useState("new");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [history, setHistory] = useState<DiseaseScan[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { getToken } = useAuth();

  // Language options
  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिंदी)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "ml", name: "Malayalam (മലയാളം)" },
    { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "bn", name: "Bengali (বাংলা)" },
  ];

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const token = await getToken();
      const response: any = await axios.get("/disease/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.success) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      const token = await getToken();

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64data = reader.result as string;

        try {
          const response: any = await axios.post(
            "/disease/analyze",
            {
              imageBase64: base64data,
              language: selectedLanguage,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (response.success) {
            setAnalysisResult(response.data.analysis);
            toast.success(t("analyze.success"));
            fetchHistory(); // Refresh history
          }
        } catch (error: any) {
          console.error("Analysis error:", error);
          toast.error(error.message || t("analyze.error"));
        } finally {
          setIsAnalyzing(false);
        }
      };
    } catch (error) {
      console.error("Error preparing image:", error);
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistory = (scan: DiseaseScan) => {
    setAnalysisResult(scan.analysis);
    setActiveTab("new");
    // Optionally restore image preview if needed, but we don't have the file object easily
    // So we just show the result
  };

  // Custom Button Component
  const Button = ({
    children,
    onClick,
    disabled,
    className,
    variant = "default",
    size = "default",
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: "default" | "ghost" | "outline";
    size?: "default" | "sm" | "lg" | "icon";
  }) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="container max-w-7xl p-4 mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div
          className={cn(
            "space-y-6 transition-all duration-500 ease-in-out",
            analysisResult ? "lg:col-span-12" : "lg:col-span-8",
          )}
        >
          {/* Custom Tabs */}
          <div className="w-full">
            {!analysisResult && (
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                  <button
                    onClick={() => setActiveTab("new")}
                    className={cn(
                      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 cursor-pointer",
                      activeTab === "new"
                        ? "bg-background text-foreground shadow-sm"
                        : "hover:bg-background/50 hover:text-foreground",
                    )}
                  >
                    <PlusCircle className="w-4 h-4" />
                    {t("newScan")}
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={cn(
                      "lg:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 cursor-pointer",
                      activeTab === "history"
                        ? "bg-background text-foreground shadow-sm"
                        : "hover:bg-background/50 hover:text-foreground",
                    )}
                  >
                    <HistoryIcon className="w-4 h-4" />
                    {t("historyTab")}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "new" && (
              <div className="space-y-6 m-0 animate-in fade-in duration-300">
                {!analysisResult ? (
                  <div className="space-y-6">
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      onClear={() => setSelectedImage(null)}
                      selectedImage={selectedImage}
                      disabled={isAnalyzing}
                    />

                    <div className="flex justify-end items-center gap-4">
                      {/* Language Selector */}
                      <div className="relative">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          disabled={isAnalyzing}
                          aria-label={t("language.label")}
                          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none pr-8 cursor-pointer"
                        >
                          {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        onClick={handleAnalyze}
                        disabled={!selectedImage || isAnalyzing}
                        className="min-w-[150px]"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t("analyze.loading")}
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            {t("analyze.button")}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-start items-center">
                      <Button
                        variant="ghost"
                        className="pl-0 hover:bg-transparent hover:text-primary"
                        onClick={() => {
                          setAnalysisResult(null);
                          setSelectedImage(null);
                        }}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {t("startNewScan")}
                      </Button>
                    </div>
                    <AnalysisResult analysis={analysisResult} />
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="lg:hidden m-0 animate-in fade-in duration-300">
                <DiseaseHistory
                  scans={history}
                  onSelectScan={handleSelectHistory}
                  isLoading={isLoadingHistory}
                />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Sidebar for History */}
        {!analysisResult && (
          <div className="hidden lg:block lg:col-span-4 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-foreground">
                {t("recentScans")}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchHistory}
                disabled={isLoadingHistory}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoadingHistory ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            <div className="border border-border rounded-xl bg-surface">
              <DiseaseHistory
                scans={history}
                onSelectScan={handleSelectHistory}
                isLoading={isLoadingHistory}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
