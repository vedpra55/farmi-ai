"use client";

import { useOnboardingStore } from "../_store/onboarding-store";
import { OnboardingShell } from "./onboarding-shell";
import { OptionCard } from "./option-card";
import {
  SOIL_TYPES,
  IRRIGATION_METHODS,
  WATER_AVAILABILITY,
} from "../_lib/constants";

export function StepFarmSetup() {
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
          Your farm details
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Help us understand your farming setup.
        </p>

        <div className="mt-6 space-y-6">
          {/* Farm Size */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
              Farm Size (acres)
            </label>
            <p className="text-xs text-foreground-muted mb-1.5">
              Total cultivable area you currently farm
            </p>
            <input
              type="number"
              inputMode="decimal"
              value={store.farmSize}
              onChange={(e) => store.setField("farmSize", e.target.value)}
              placeholder="e.g. 5"
              className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
            />
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-1">
              Soil Type
            </label>
            <p className="text-xs text-foreground-muted mb-2.5">
              If unsure, pick the closest match — you can change later
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {SOIL_TYPES.map((s) => (
                <OptionCard
                  key={s.value}
                  label={s.label}
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
              Irrigation Method
            </label>
            <p className="text-xs text-foreground-muted mb-2.5">
              Your primary source of water for crops
            </p>
            <div className="space-y-2.5">
              {IRRIGATION_METHODS.map((m) => (
                <OptionCard
                  key={m.value}
                  label={m.label}
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
              Water Availability
            </label>
            <p className="text-xs text-foreground-muted mb-2.5">
              General water situation across your farming seasons
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {WATER_AVAILABILITY.map((w) => (
                <OptionCard
                  key={w.value}
                  label={w.label}
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
