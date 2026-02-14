"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Sprout,
  ShieldCheck,
  Activity,
  Maximize2,
  AlertOctagon,
  ThermometerSun,
  Bug,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DiseaseAnalysis {
  language: string;
  crop: string;
  isHealthy: boolean;
  diseaseName: string;
  diseaseType:
    | "fungal"
    | "bacterial"
    | "viral"
    | "pest"
    | "nutrient_deficiency"
    | "abiotic_stress"
    | "unknown";
  confidence: number;
  severity: "low" | "medium" | "high" | "unknown";
  summary: string;
  symptoms: string[];
  causes: string[];
  spreadRisk: string[];
  immediateActions: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  prevention: string[];
  monitoring: string[];
  whenToSeekHelp: string[];
  imageQuality: "good" | "ok" | "poor";
  imageNotes: string;
}

interface AnalysisResultProps {
  analysis: DiseaseAnalysis;
}

export const AnalysisResult = ({ analysis }: AnalysisResultProps) => {
  const t = useTranslations("Disease.result");

  const SeverityBadge = ({ severity }: { severity: string }) => {
    let colorClass = "bg-gray-100 text-gray-800 border-gray-200";
    let icon = <HelpCircle className="w-3.5 h-3.5 mr-1" />;

    if (severity === "high") {
      colorClass =
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50";
      icon = <AlertOctagon className="w-3.5 h-3.5 mr-1" />;
    } else if (severity === "medium") {
      colorClass =
        "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50";
      icon = <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
    } else if (severity === "low") {
      colorClass =
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/50";
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
    }

    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
          colorClass,
        )}
      >
        {icon}
        {t(`severity.${severity}` as any)} {t("severityLabel")}
      </span>
    );
  };

  const DiseaseTypeBadge = ({ type }: { type: string }) => {
    let icon = <Activity className="w-3.5 h-3.5 mr-1" />;
    if (type === "fungal" || type === "bacterial" || type === "viral")
      icon = <Bug className="w-3.5 h-3.5 mr-1" />;
    if (type === "abiotic_stress")
      icon = <ThermometerSun className="w-3.5 h-3.5 mr-1" />;

    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
        {icon}
        {type.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Card */}
      <div className="rounded-2xl bg-surface border border-border p-6 md:p-8 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <span className="inline-flex items-center rounded-full bg-surface-elevated px-3 py-1 text-xs font-medium text-foreground border border-border">
            {analysis.crop}
          </span>
          {!analysis.isHealthy && (
            <>
              <SeverityBadge severity={analysis.severity} />
              <DiseaseTypeBadge type={analysis.diseaseType} />
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          {analysis.diseaseName}
        </h1>

        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground leading-relaxed text-lg">
            {analysis.summary}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>{t("confidence")}</span>
          <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                analysis.confidence > 80
                  ? "bg-green-500"
                  : analysis.confidence > 60
                    ? "bg-yellow-500"
                    : "bg-red-500",
              )}
              style={{ width: `${analysis.confidence}%` }}
            />
          </div>
          <span className="font-mono font-medium">
            {Math.round(analysis.confidence)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms Section */}
        <div className="rounded-2xl bg-surface border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
            <Activity className="w-5 h-5 text-red-500" />
            {t("symptoms")}
          </h3>
          <ul className="space-y-3">
            {analysis.symptoms.map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                <span className="block w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Causes & Risk */}
        <div className="rounded-2xl bg-surface border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
            <Maximize2 className="w-5 h-5 text-orange-500" />
            {t("causes")}
          </h3>
          <ul className="space-y-3">
            {analysis.causes.map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground text-sm">
                <span className="block w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {analysis.spreadRisk.length > 0 && (
            <div className="mt-5 pt-5 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                {t("spreadRisk")}
              </h4>
              <ul className="space-y-2">
                {analysis.spreadRisk.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground ml-6">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Treatment - Organic */}
        <div className="rounded-2xl bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400 mb-4">
            <Sprout className="w-5 h-5" />
            {t("organic")}
          </h3>
          <ul className="space-y-3">
            {analysis.organicTreatment.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-foreground/80 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Treatment - Chemical */}
        <div className="rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-700 dark:text-blue-400 mb-4">
            <Droplets className="w-5 h-5" />
            {t("chemical")}
          </h3>
          <ul className="space-y-3">
            {analysis.chemicalTreatment.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-foreground/80 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Immediate Actions */}
      <div className="rounded-2xl bg-surface-elevated border border-border p-6 md:p-8 shadow-md">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
          <ShieldCheck className="w-5 h-5 text-primary" />
          {t("actions")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.immediateActions.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-border/50"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <span className="text-sm font-medium text-foreground">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-surface/50 border border-border/50 p-5">
          <h4 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">
            {t("prevention")}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analysis.prevention.join(". ")}
          </p>
        </div>
        <div className="rounded-xl bg-surface/50 border border-border/50 p-5">
          <h4 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">
            {t("monitor")}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analysis.monitoring.join(". ")}
          </p>
        </div>
      </div>
    </div>
  );
};
