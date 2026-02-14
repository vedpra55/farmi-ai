import { CheckCircle2, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function SetupProgress() {
  const t = useTranslations("DashboardHome.setup");
  const [isScanComplete, setIsScanComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const checkDiseaseHistory = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response: any = await axios.get("/disease/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.success && response.data.length > 0) {
          setIsScanComplete(true);
        }
      } catch (error) {
        console.error("Failed to check disease history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDiseaseHistory();
  }, [getToken]);

  const completedCount = 1 + (isScanComplete ? 1 : 0);

  return (
    <section className="bg-background border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">{t("title")}</h3>
        <span className="text-xs font-mono bg-secondary px-2 py-1 rounded text-foreground">
          {t("completed", { done: completedCount })}
        </span>
      </div>

      <div className="space-y-4">
        {/* Completed Step */}
        <div className="flex items-center gap-4">
          <div className="shrink-0 text-success">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground line-through decoration-muted-foreground/30 opacity-50">
              {t("profileComplete")}
            </p>
          </div>
        </div>

        {/* Current Step */}
        {isScanComplete ? (
          <div className="flex items-center gap-4">
            <div className="shrink-0 text-success">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground line-through decoration-muted-foreground/30 opacity-50">
                {t("scanFirst")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 opacity-50">
                {t("scanRequired")}
              </p>
            </div>
          </div>
        ) : (
          <Link
            href="/app/disease"
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="shrink-0 text-primary group-hover:scale-110 transition-transform">
              <Circle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                {t("scanFirst")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("scanRequired")}
              </p>
            </div>
            <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full group-hover:bg-primary/90 transition-colors">
              {t("start")}
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
