"use client";

import { useOnboardingStore } from "../_store/onboarding-store";
import { OnboardingShell } from "./onboarding-shell";
import { GROWTH_STAGES } from "../_lib/constants";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

export function StepCropSetup() {
  const t = useTranslations("Onboarding.cropSetup");
  const store = useOnboardingStore();

  const isValid = store.crops.every(
    (c) => c.cropName.trim().length > 0 && c.sowingDate.length > 0,
  );

  return (
    <OnboardingShell
      onNext={store.nextStep}
      onBack={store.prevStep}
      nextDisabled={!isValid}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">{t("subtitle")}</p>

        <div className="mt-6 space-y-4">
          {store.crops.map((crop, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-border bg-surface-elevated p-4 space-y-4"
            >
              {/* Remove button */}
              {store.crops.length > 1 && (
                <button
                  type="button"
                  onClick={() => store.removeCrop(index)}
                  className="absolute top-3 right-3 h-6 w-6 rounded-full bg-surface hover:bg-danger-light text-foreground-muted hover:text-danger flex items-center justify-center transition-all text-xs cursor-pointer"
                  title={t("remove")}
                >
                  ✕
                </button>
              )}

              {/* Crop Name */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  {t("cropName.label")}
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  {t("cropName.description")}
                </p>
                <input
                  type="text"
                  value={crop.cropName}
                  onChange={(e) =>
                    store.updateCrop(index, "cropName", e.target.value)
                  }
                  placeholder={t("cropName.placeholder")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                />
              </div>

              {/* Sowing Date */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  {t("sowingDate.label")}
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  {t("sowingDate.description")}
                </p>
                <input
                  type="date"
                  value={crop.sowingDate}
                  onChange={(e) =>
                    store.updateCrop(index, "sowingDate", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                />
              </div>

              {/* Growth Stage */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  {t("growthStage.label")}
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  {t("growthStage.description")}
                </p>
                <select
                  value={crop.growthStage}
                  onChange={(e) =>
                    store.updateCrop(index, "growthStage", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                >
                  <option value="">{t("growthStage.placeholder")}</option>
                  {GROWTH_STAGES.map((g) => (
                    <option key={g.value} value={g.value}>
                      {t(`growthStage.options.${g.value}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disease History Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground-secondary">
                    {t("diseaseHistory.label")}
                  </label>
                  <p className="text-xs text-foreground-muted">
                    {t("diseaseHistory.description")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    store.updateCrop(
                      index,
                      "pastDiseaseHistory",
                      !crop.pastDiseaseHistory,
                    )
                  }
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
                    ${crop.pastDiseaseHistory ? "bg-primary" : "bg-border-strong"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 rounded-full bg-white transition-transform
                      ${crop.pastDiseaseHistory ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              {/* Average Yield */}
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  {t("yield.label")}{" "}
                  <span className="text-foreground-muted font-normal">
                    {t("yield.optional")}
                  </span>
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  {t("yield.description")}
                </p>
                <input
                  type="number"
                  inputMode="decimal"
                  value={crop.averageYieldLastSeason}
                  onChange={(e) =>
                    store.updateCrop(
                      index,
                      "averageYieldLastSeason",
                      e.target.value,
                    )
                  }
                  placeholder={t("yield.placeholder")}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                />
              </div>
            </div>
          ))}

          {/* Add crop */}
          <Button variant="ghost" size="md" fullWidth onClick={store.addCrop}>
            {t("addCrop")}
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
