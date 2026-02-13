"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "../_store/onboarding-store";
import { OnboardingShell } from "./onboarding-shell";
import { completeOnboarding } from "../_actions";
import {
  LANGUAGES,
  SOIL_TYPES,
  IRRIGATION_METHODS,
  WATER_AVAILABILITY,
  GROWTH_STAGES,
} from "../_lib/constants";

function getLabel(
  list: readonly { value: string; label: string }[],
  value: string,
) {
  return list.find((i) => i.value === value)?.label || value;
}

export function StepConfirm() {
  const store = useOnboardingStore();
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await completeOnboarding({
        name: store.name,
        preferredLanguage: store.preferredLanguage,
        phoneNumber: store.phoneNumber,
        location: {
          state: store.state,
          district: store.district,
          villageOrTown: store.villageOrTown,
          latitude: store.latitude,
          longitude: store.longitude,
        },
        farmProfile: {
          farmSize: Number(store.farmSize),
          soilType: store.soilType,
          irrigationMethod: store.irrigationMethod,
          waterAvailability: store.waterAvailability,
        },
        crops: store.crops.map((c) => ({
          cropName: c.cropName,
          sowingDate: c.sowingDate,
          growthStage: c.growthStage,
          pastDiseaseHistory: c.pastDiseaseHistory,
          averageYieldLastSeason: c.averageYieldLastSeason
            ? Number(c.averageYieldLastSeason)
            : undefined,
        })),
      });

      if (res?.error) {
        setError(res.error);
        setIsSubmitting(false);
        return;
      }

      // Refresh Clerk session to pick up updated publicMetadata
      await user?.reload();
      store.reset();
      router.push("/app");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingShell
      onNext={handleSubmit}
      onBack={store.prevStep}
      nextLabel="Start Farming with AI →"
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col items-center">
        {/* Illustration */}
        <div className="relative h-36 w-36 mb-6">
          <Image
            src="/assets/farmer-2.png"
            alt="Farmer celebrating"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground text-center">
          You&apos;re all set! 🎉
        </h1>
        <p className="mt-2 text-sm text-foreground-muted text-center">
          Review your details before we create your farm profile.
        </p>

        {error && (
          <div className="mt-4 w-full rounded-lg bg-danger-light border border-danger px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 w-full space-y-4">
          {/* Profile */}
          <SummarySection title="Profile" onEdit={() => store.goToStep(2)}>
            <SummaryRow label="Name" value={store.name} />
            <SummaryRow
              label="Language"
              value={getLabel(LANGUAGES, store.preferredLanguage)}
            />
            {store.phoneNumber && (
              <SummaryRow label="Phone" value={store.phoneNumber} />
            )}
          </SummarySection>

          {/* Location */}
          <SummarySection title="Location" onEdit={() => store.goToStep(2)}>
            <SummaryRow
              label="Location"
              value={[store.villageOrTown, store.district, store.state]
                .filter(Boolean)
                .join(", ")}
            />
          </SummarySection>

          {/* Farm */}
          <SummarySection title="Farm" onEdit={() => store.goToStep(3)}>
            <SummaryRow label="Size" value={`${store.farmSize} acres`} />
            <SummaryRow
              label="Soil"
              value={getLabel(SOIL_TYPES, store.soilType)}
            />
            <SummaryRow
              label="Irrigation"
              value={getLabel(IRRIGATION_METHODS, store.irrigationMethod)}
            />
            <SummaryRow
              label="Water"
              value={getLabel(WATER_AVAILABILITY, store.waterAvailability)}
            />
          </SummarySection>

          {/* Crops */}
          <SummarySection title="Crops" onEdit={() => store.goToStep(4)}>
            {store.crops.map((c, i) => (
              <SummaryRow
                key={i}
                label={c.cropName}
                value={`Sown: ${c.sowingDate}${c.growthStage ? ` · ${getLabel(GROWTH_STAGES, c.growthStage)}` : ""}`}
              />
            ))}
          </SummarySection>
        </div>
      </div>
    </OnboardingShell>
  );
}

// ── Helper Components ──────────────────────────

function SummarySection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-primary hover:underline cursor-pointer"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between text-sm">
      <span className="text-foreground-muted shrink-0">{label}</span>
      <span className="text-foreground font-medium text-right ml-4 wrap-break-word max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
