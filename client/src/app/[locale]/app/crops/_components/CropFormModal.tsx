"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { ICropDetail } from "@/types/user";
import { useTranslations } from "next-intl";

const GROWTH_STAGES = [
  "germination",
  "vegetative",
  "flowering",
  "fruiting",
  "harvesting",
] as const;

interface CropFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ICropDetail, "_id">) => Promise<void>;
  initialData?: ICropDetail | null;
}

export function CropFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CropFormModalProps) {
  const t = useTranslations("Crops.form");
  const isEditing = !!initialData;

  const [cropName, setCropName] = useState("");
  const [sowingDate, setSowingDate] = useState("");
  const [growthStage, setGrowthStage] = useState("");
  const [pastDiseaseHistory, setPastDiseaseHistory] = useState(false);
  const [averageYield, setAverageYield] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Sync form fields whenever modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setCropName(initialData?.cropName || "");
      setSowingDate(
        initialData?.sowingDate
          ? new Date(initialData.sowingDate).toISOString().split("T")[0]
          : "",
      );
      setGrowthStage(initialData?.growthStage || "");
      setPastDiseaseHistory(initialData?.pastDiseaseHistory || false);
      setAverageYield(initialData?.averageYieldLastSeason?.toString() || "");
      setError("");
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!cropName.trim() || !sowingDate) {
      setError(t("errors.required"));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        cropName: cropName.trim(),
        sowingDate: new Date(sowingDate),
        growthStage,
        pastDiseaseHistory,
        averageYieldLastSeason: averageYield ? Number(averageYield) : undefined,
      });
      onClose();
    } catch {
      setError(t("errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t("titleEdit") : t("titleAdd")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        {/* Crop Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            {t("cropName.label")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            placeholder={t("cropName.placeholder")}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Sowing Date */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            {t("sowingDate.label")} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={sowingDate}
            onChange={(e) => setSowingDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Growth Stage */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            {t("growthStage.label")}
          </label>
          <select
            value={growthStage}
            onChange={(e) => setGrowthStage(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="">{t("growthStage.placeholder")}</option>
            {GROWTH_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {t(`growthStage.options.${stage}` as any)}
              </option>
            ))}
          </select>
        </div>

        {/* Past Disease History */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="diseaseHistory"
            checked={pastDiseaseHistory}
            onChange={(e) => setPastDiseaseHistory(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
          />
          <label
            htmlFor="diseaseHistory"
            className="text-sm font-medium text-foreground"
          >
            {t("pastDiseaseHistory.label")}
          </label>
        </div>

        {/* Average Yield */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            {t("averageYield.label")}{" "}
            <span className="text-muted-foreground font-normal">
              {t("averageYield.optional")}
            </span>
          </label>
          <input
            type="number"
            value={averageYield}
            onChange={(e) => setAverageYield(e.target.value)}
            placeholder={t("averageYield.placeholder")}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? t("saving")
              : isEditing
                ? t("saveChanges")
                : t("addCrop")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
