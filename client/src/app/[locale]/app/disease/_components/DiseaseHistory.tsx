"use client";

import { Calendar, ChevronRight, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

// Make sure this matches the backend model structure
export interface DiseaseScan {
  _id: string;
  createdAt: string;
  analysis: {
    diseaseName: string;
    isHealthy: boolean;
    confidence: number;
    severity: "low" | "medium" | "high" | "unknown";
    crop: string;
  };
  image: {
    data: string; // base64
  };
}

interface DiseaseHistoryProps {
  scans: DiseaseScan[];
  onSelectScan: (scan: DiseaseScan) => void;
  selectedId?: string;
  isLoading?: boolean;
}

export const DiseaseHistory = ({
  scans,
  onSelectScan,
  selectedId,
  isLoading = false,
}: DiseaseHistoryProps) => {
  const t = useTranslations("Disease.history");
  const locale = useLocale();

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  // Custom Badge Component
  const Badge = ({
    className,
    variant = "default",
    children,
  }: {
    className?: string;
    variant?: "default" | "outline";
    children: React.ReactNode;
  }) => {
    const variants = {
      default:
        "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
      outline: "text-foreground",
    };
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          className,
        )}
      >
        {children}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
        <Sprout className="w-8 h-8 opacity-20" />
        <p className="text-sm">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] pr-4 overflow-y-auto custom-scrollbar">
      <div className="space-y-3 p-3">
        {scans.map((scan) => (
          <div
            key={scan._id}
            onClick={() => onSelectScan(scan)}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
              selectedId === scan._id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-surface",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                {/* We use the base64 data directly */}
                <img
                  src={`data:image/jpeg;base64,${scan.image.data}`}
                  alt={scan.analysis.crop}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm leading-none text-foreground">
                  {scan.analysis.diseaseName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{dateFormatter.format(new Date(scan.createdAt))}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!scan.analysis.isHealthy && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 h-5 border",
                    scan.analysis.severity === "high"
                      ? "text-destructive border-destructive/20"
                      : "text-orange-500 border-orange-500/20",
                  )}
                >
                  {t(`severity.${scan.analysis.severity}` as any)}
                </Badge>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
