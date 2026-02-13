"use client";

import { useOnboardingStore } from "../_store/onboarding-store";
import { OnboardingShell } from "./onboarding-shell";
import { OptionCard } from "./option-card";
import {
  SOIL_TYPES,
  IRRIGATION_METHODS,
  WATER_AVAILABILITY,
} from "../_lib/constants";

import { useTranslations } from "next-intl";

export function StepFarmSetup() {
  const t = useTranslations("Onboarding.farmSetup");
  const store = useOnboardingStore();

  const isValid =
    store.farmSize.trim().length > 0 &&
    store.soilType.length > 0 &&
    store.irrigationMethod.length > 0 &&
    store.waterAvailability.length > 0;

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

        <div className="mt-6 space-y-6">
          {/* Farm Size */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
              {t("farmSize.label")}
            </label>
            <p className="text-xs text-foreground-muted mb-1.5">
              {t("farmSize.description")}
            </p>
            <input
              type="number"
              inputMode="decimal"
              value={store.farmSize}
              onChange={(e) => store.setField("farmSize", e.target.value)}
              placeholder={t("farmSize.placeholder")}
              className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
            />
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-1">
              {t("soilType.label")}
            </label>
            <p className="text-xs text-foreground-muted mb-2.5">
              {t("soilType.description")}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {SOIL_TYPES.map((s) => (
                <OptionCard
                  key={s.value}
                  label={t(`soilType.options.${s.value}`)}
                  icon={s.icon}
                  selected={store.soilType === s.value}
                  onClick={() => store.setField("soilType", s.value)}
                />
              ))}
            </div>
          </div>

          {/* Irrigation Method */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-1">
              {t("irrigation.label")}
            </label>
            <p className="text-xs text-foreground-muted mb-2.5">
              {t("irrigation.description")}
            </p>
            <div className="space-y-2.5">
              {IRRIGATION_METHODS.map((m) => (
                <OptionCard
                  key={m.value}
                  label={t(`irrigation.options.${m.value}`)}
                  icon={m.icon}
                  selected={store.irrigationMethod === m.value}
                  onClick={() => store.setField("irrigationMethod", m.value)}
                />
              ))}
            </div>
          </div>

          {/* Water Availability */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-1">
              {t("water.label")}
            </label>
            <p className="text-xs text-foreground-muted mb-2.5">
              {t("water.description")}
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {WATER_AVAILABILITY.map((w) => (
                <OptionCard
                  key={w.value}
                  label={t(`water.options.${w.value}`)}
                  selected={store.waterAvailability === w.value}
                  onClick={() => store.setField("waterAvailability", w.value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
