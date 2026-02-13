"use client";

import Image from "next/image";
import { useOnboardingStore } from "../_store/onboarding-store";
import { OnboardingShell } from "./onboarding-shell";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: "🌱", text: "Smart crop monitoring" },
  { icon: "🔬", text: "AI disease detection" },
  { icon: "🌦️", text: "Weather-based alerts" },
];

export function StepIntro() {
  const nextStep = useOnboardingStore((s) => s.nextStep);

  return (
    <OnboardingShell hideProgress hideNav>
      <div className="flex min-h-[calc(100dvh-48px)] flex-col items-center justify-center text-center">
        {/* Illustration */}
        <div className="relative h-44 w-44 mb-6">
          <Image
            src="/assets/farmer-1.png"
            alt="Farmer illustration"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Let&apos;s set up your account
        </h1>

        {/* Subtext */}
        <p className="mt-2 text-sm text-foreground-muted max-w-[280px] leading-relaxed">
          FarmAI gives you personalized crop insights, disease detection, and
          weather alerts — tailored to your farm.
        </p>

        {/* Features */}
        <div className="mt-8 w-full max-w-[280px] space-y-2.5">
          {FEATURES.map((f) => (
            <div
              key={f.text}
              className="flex items-center justify-center gap-3 rounded-xl bg-surface-elevated border border-border px-4 py-3"
            >
              <span className="text-base">{f.icon}</span>
              <span className="text-sm font-medium text-foreground-secondary">
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA — part of the centered content */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={nextStep}
          className="mt-10 max-w-[280px]"
        >
          Get Started →
        </Button>
      </div>
    </OnboardingShell>
  );
}
