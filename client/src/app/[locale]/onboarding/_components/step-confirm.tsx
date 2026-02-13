"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "../_store/onboarding-store";
import { OnboardingShell } from "./onboarding-shell";
import { completeOnboarding } from "../_actions";
import { useTranslations } from "next-intl";
import { LANGUAGES } from "../_lib/constants";
import { useUserStore } from "@/store/user-store";

export function StepConfirm() {
  const t = useTranslations("Onboarding");
  const store = useOnboardingStore();
  const { user } = useUser();
  const { getToken } = useAuth();
  const fetchUser = useUserStore((state) => state.fetchUser);
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
      const token = await getToken();
      if (token) {
        await fetchUser(token);
      }
      store.reset();
      router.push("/app");
    } catch {
      setError(t("confirm.error"));
      setIsSubmitting(false);
    }
  };

  const getOptionLabel = (category: string, value: string) => {
    if (!value) return "";
    return t(`${category}.options.${value}`);
  };

  return (
    <OnboardingShell
      onNext={handleSubmit}
      onBack={store.prevStep}
      nextLabel={t("confirm.submit")}
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
          {t("confirm.title")}
        </h1>
        <p className="mt-2 text-sm text-foreground-muted text-center">
          {t("confirm.subtitle")}
        </p>

        {error && (
          <div className="mt-4 w-full rounded-lg bg-danger-light border border-danger px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 w-full space-y-4">
          {/* Profile */}
          <SummarySection
            title={t("confirm.sections.profile")}
            onEdit={() => store.goToStep(2)}
            editLabel={t("confirm.edit")}
          >
            <SummaryRow label={t("confirm.labels.name")} value={store.name} />
            <SummaryRow
              label={t("confirm.labels.language")}
              value={
                LANGUAGES.find((l) => l.value === store.preferredLanguage)
                  ?.label || store.preferredLanguage
              }
            />
            {store.phoneNumber && (
              <SummaryRow
                label={t("confirm.labels.phone")}
                value={store.phoneNumber}
              />
            )}
          </SummarySection>

          {/* Location */}
          <SummarySection
            title={t("confirm.sections.location")}
            onEdit={() => store.goToStep(2)}
            editLabel={t("confirm.edit")}
          >
            <SummaryRow
              label={t("confirm.sections.location")}
              value={[store.villageOrTown, store.district, store.state]
                .filter(Boolean)
                .join(", ")}
            />
          </SummarySection>

          {/* Farm */}
          <SummarySection
            title={t("confirm.sections.farm")}
            onEdit={() => store.goToStep(3)}
            editLabel={t("confirm.edit")}
          >
            <SummaryRow
              label={t("confirm.labels.size")}
              value={`${store.farmSize} ${t("farmSetup.farmSize.unit")}`}
            />
            <SummaryRow
              label={t("confirm.labels.soil")}
              value={getOptionLabel("farmSetup.soilType", store.soilType)}
            />
            <SummaryRow
              label={t("confirm.labels.irrigation")}
              value={getOptionLabel(
                "farmSetup.irrigation",
                store.irrigationMethod,
              )}
            />
            <SummaryRow
              label={t("confirm.labels.water")}
              value={getOptionLabel("farmSetup.water", store.waterAvailability)}
            />
          </SummarySection>

          {/* Crops */}
          <SummarySection
            title={t("confirm.sections.crops")}
            onEdit={() => store.goToStep(4)}
            editLabel={t("confirm.edit")}
          >
            {store.crops.map((c, i) => (
              <SummaryRow
                key={i}
                label={c.cropName}
                value={`${t("confirm.labels.sown")}: ${c.sowingDate}${c.growthStage ? ` · ${t(`cropSetup.growthStage.options.${c.growthStage}`)}` : ""}`}
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
  editLabel,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
  editLabel: string;
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
          {editLabel}
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
