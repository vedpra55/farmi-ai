"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore } from "../_store/onboarding-store";
import { ONBOARDING_STEPS } from "../_lib/constants";
import { Button } from "@/components/ui/button";

interface OnboardingShellProps {
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isSubmitting?: boolean;
  hideNav?: boolean;
  hideProgress?: boolean;
}

export function OnboardingShell({
  children,
  onNext,
  onBack,
  nextLabel = "Continue",
  nextDisabled = false,
  isSubmitting = false,
  hideNav = false,
  hideProgress = false,
}: OnboardingShellProps) {
  const step = useOnboardingStore((s) => s.step);

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* ── Progress Dots ────────────────────────────── */}
      {!hideProgress && (
        <div className="flex-shrink-0 flex items-center justify-center gap-2 pt-6 pb-2 px-4">
          {ONBOARDING_STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary" : "w-2 bg-border-strong"}
                `}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Scrollable Body ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-md px-5 py-6 md:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Fixed Footer ─────────────────────────────── */}
      {!hideNav && (
        <div className="flex-shrink-0 border-t border-border bg-background px-5 py-4">
          <div className="mx-auto flex max-w-md items-center gap-3">
            {step > 0 && onBack && (
              <Button
                variant="ghost"
                size="lg"
                onClick={onBack}
                className="flex-shrink-0"
              >
                ← Back
              </Button>
            )}
            <div className="flex-1" />
            {onNext && (
              <Button
                variant="primary"
                size="lg"
                onClick={onNext}
                disabled={nextDisabled}
                isLoading={isSubmitting}
                className="min-w-[140px]"
              >
                {nextLabel}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
