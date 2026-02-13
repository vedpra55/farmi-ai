import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface CropDetail {
  cropName: string;
  sowingDate: string;
  growthStage: string;
  pastDiseaseHistory: boolean;
  averageYieldLastSeason: string;
}

export interface OnboardingData {
  // Step 1 — Language
  preferredLanguage: string;

  // Step 2 — Basic Info
  name: string;
  phoneNumber: string;
  state: string;
  district: string;
  villageOrTown: string;
  latitude: number;
  longitude: number;

  // Step 3 — Farm Setup
  farmSize: string;
  soilType: string;
  irrigationMethod: string;
  waterAvailability: string;

  // Step 4 — Crop Setup
  crops: CropDetail[];
}

interface OnboardingStore extends OnboardingData {
  step: number;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Field updates
  setField: <K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K],
  ) => void;

  // Crop helpers
  addCrop: () => void;
  removeCrop: (index: number) => void;
  updateCrop: (
    index: number,
    field: keyof CropDetail,
    value: string | boolean,
  ) => void;

  // Reset
  reset: () => void;
}

// ──────────────────────────────────────────────
// Defaults
// ──────────────────────────────────────────────

const DEFAULT_CROP: CropDetail = {
  cropName: "",
  sowingDate: "",
  growthStage: "",
  pastDiseaseHistory: false,
  averageYieldLastSeason: "",
};

const DEFAULT_DATA: OnboardingData = {
  preferredLanguage: "",
  name: "",
  phoneNumber: "",
  state: "",
  district: "",
  villageOrTown: "",
  latitude: 0,
  longitude: 0,
  farmSize: "",
  soilType: "",
  irrigationMethod: "",
  waterAvailability: "",
  crops: [{ ...DEFAULT_CROP }],
};

// ──────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...DEFAULT_DATA,
      step: 0,

      nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 5) })),
      prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
      goToStep: (step) => set({ step }),

      setField: (key, value) => set({ [key]: value }),

      addCrop: () => set((s) => ({ crops: [...s.crops, { ...DEFAULT_CROP }] })),

      removeCrop: (index) =>
        set((s) => ({
          crops: s.crops.filter((_, i) => i !== index),
        })),

      updateCrop: (index, field, value) =>
        set((s) => ({
          crops: s.crops.map((crop, i) =>
            i === index ? { ...crop, [field]: value } : crop,
          ),
        })),

      reset: () => set({ ...DEFAULT_DATA, step: 0 }),
    }),
    {
      name: "farmAI-onboarding",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
