"use client";

import { useOnboardingStore } from "../_store/onboarding-store";
import { OnboardingShell } from "./onboarding-shell";
import { OptionCard } from "./option-card";
import { LANGUAGES } from "../_lib/constants";

import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function StepLanguage() {
  const { preferredLanguage, setField, nextStep, prevStep } =
    useOnboardingStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleNext = () => {
    // 1. Change locale URL if language is supported
    if (
      preferredLanguage &&
      routing.locales.includes(preferredLanguage as any)
    ) {
      router.replace(pathname, { locale: preferredLanguage });
    }

    // 2. Advance step (persisted in store)
    nextStep();
  };

  return (
    <OnboardingShell
      onNext={handleNext}
      onBack={prevStep}
      nextDisabled={!preferredLanguage}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Choose your language
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          We&apos;ll show everything in your preferred language — alerts,
          recommendations, and chat will all use this.
        </p>

        <div className="mt-6 space-y-2.5">
          {LANGUAGES.map((lang) => (
            <OptionCard
              key={lang.value}
              label={lang.native}
              subtitle={lang.label}
              selected={preferredLanguage === lang.value}
              onClick={() => setField("preferredLanguage", lang.value)}
            />
          ))}
        </div>
      </div>
    </OnboardingShell>
  );
}
