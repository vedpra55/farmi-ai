"use client";

import { useCallback } from "react";
import { useOnboardingStore } from "../_store/onboarding-store";
import { OnboardingShell } from "./onboarding-shell";
import { LocationPicker } from "./location-picker";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useLocation } from "@/hooks/use-location";

export function StepBasicInfo() {
  const t = useTranslations("Onboarding.basicInfo");
  const store = useOnboardingStore();
  const { detecting, detectLocation } = useLocation();

  const isValid = store.name.trim().length > 0 && store.state.trim().length > 0;

  const handleDetectLocation = useCallback(() => {
    detectLocation((data) => {
      store.setField("latitude", data.latitude);
      store.setField("longitude", data.longitude);
      if (data.state) store.setField("state", data.state);
      if (data.district) store.setField("district", data.district);
      if (data.villageOrTown)
        store.setField("villageOrTown", data.villageOrTown);
    });
  }, [detectLocation, store]);

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

        <div className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
              {t("name.label")}
            </label>
            <p className="text-xs text-foreground-muted mb-1.5">
              {t("name.description")}
            </p>
            <input
              type="text"
              value={store.name}
              onChange={(e) => store.setField("name", e.target.value)}
              placeholder={t("name.placeholder")}
              className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
              {t("phone.label")}{" "}
              <span className="text-foreground-muted font-normal">
                {t("phone.optional")}
              </span>
            </label>
            <p className="text-xs text-foreground-muted mb-1.5">
              {t("phone.description")}
            </p>
            <input
              type="tel"
              value={store.phoneNumber}
              onChange={(e) => store.setField("phoneNumber", e.target.value)}
              placeholder={t("phone.placeholder")}
              className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
            />
          </div>

          {/* Location Section */}
          <div className="border-t border-border pt-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-foreground">
                {t("location.title")}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDetectLocation}
                isLoading={detecting}
              >
                {t("location.detect")}
              </Button>
            </div>
            <p className="text-xs text-foreground-muted mb-4">
              {t("location.description")}
            </p>

            {/* Map */}
            {store.latitude !== 0 && store.longitude !== 0 && (
              <div className="mb-4">
                <LocationPicker />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  {t("location.state.label")}
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  {t("location.state.description")}
                </p>
                <input
                  type="text"
                  value={store.state}
                  onChange={(e) => store.setField("state", e.target.value)}
                  placeholder={t("location.state.placeholder")}
                  className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  {t("location.district.label")}
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  {t("location.district.description")}
                </p>
                <input
                  type="text"
                  value={store.district}
                  onChange={(e) => store.setField("district", e.target.value)}
                  placeholder={t("location.district.placeholder")}
                  className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  {t("location.village.label")}
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  {t("location.village.description")}
                </p>
                <input
                  type="text"
                  value={store.villageOrTown}
                  onChange={(e) =>
                    store.setField("villageOrTown", e.target.value)
                  }
                  placeholder={t("location.village.placeholder")}
                  className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
