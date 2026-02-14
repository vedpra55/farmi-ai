// ──────────────────────────────────────────────
// Languages
// ──────────────────────────────────────────────

export const LANGUAGES = [
  { value: "en", label: "English", native: "English" },
  { value: "hi", label: "Hindi", native: "हिन्दी" },
] as const;

// ──────────────────────────────────────────────
// Soil Types
// ──────────────────────────────────────────────

export const SOIL_TYPES = [
  { value: "clay", label: "Clay", icon: "🟤" },
  { value: "loamy", label: "Loamy", icon: "🟫" },
  { value: "sandy", label: "Sandy", icon: "🏖️" },
  { value: "black", label: "Black", icon: "⬛" },
  { value: "red", label: "Red", icon: "🟥" },
  { value: "alluvial", label: "Alluvial", icon: "🌊" },
] as const;

// ──────────────────────────────────────────────
// Irrigation Methods
// ──────────────────────────────────────────────

export const IRRIGATION_METHODS = [
  { value: "rain-fed", label: "Rain-fed", icon: "🌧️" },
  { value: "drip", label: "Drip", icon: "💧" },
  { value: "canal", label: "Canal", icon: "🏞️" },
  { value: "borewell", label: "Borewell", icon: "🕳️" },
  { value: "sprinkler", label: "Sprinkler", icon: "🚿" },
] as const;

// ──────────────────────────────────────────────
// Water Availability
// ──────────────────────────────────────────────

export const WATER_AVAILABILITY = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
] as const;

// ──────────────────────────────────────────────
// Growth Stages
// ──────────────────────────────────────────────

export const GROWTH_STAGES = [
  { value: "germination", label: "Germination" },
  { value: "vegetative", label: "Vegetative" },
  { value: "flowering", label: "Flowering" },
  { value: "fruiting", label: "Fruiting" },
  { value: "harvesting", label: "Harvesting" },
] as const;

// ──────────────────────────────────────────────
// Step Definitions
// ──────────────────────────────────────────────

export const ONBOARDING_STEPS = [
  { id: "intro", label: "Welcome" },
  { id: "language", label: "Language" },
  { id: "basic-info", label: "Basic Info" },
  { id: "farm-setup", label: "Farm Setup" },
  { id: "crop-setup", label: "Crop Setup" },
  { id: "confirm", label: "Confirm" },
] as const;

export const TOTAL_STEPS = ONBOARDING_STEPS.length;
