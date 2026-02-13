"use client";

import { useOnboardingStore } from "./_store/onboarding-store";
import { StepIntro } from "./_components/step-intro";
import { StepLanguage } from "./_components/step-language";
import { StepBasicInfo } from "./_components/step-basic-info";
import { StepFarmSetup } from "./_components/step-farm-setup";
import { StepCropSetup } from "./_components/step-crop-setup";
import { StepConfirm } from "./_components/step-confirm";

const STEPS = [
  StepIntro,
  StepLanguage,
  StepBasicInfo,
  StepFarmSetup,
  StepCropSetup,
  StepConfirm,
];

export default function OnboardingPage() {
  const step = useOnboardingStore((s) => s.step);
  const CurrentStep = STEPS[step];

  return <CurrentStep />;
}
