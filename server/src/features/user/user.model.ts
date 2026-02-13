import mongoose, { Schema, Document } from "mongoose";

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export const SOIL_TYPES = [
  "clay",
  "loamy",
  "sandy",
  "black",
  "red",
  "alluvial",
] as const;

export const IRRIGATION_METHODS = [
  "rain-fed",
  "drip",
  "canal",
  "borewell",
  "sprinkler",
] as const;

export const WATER_AVAILABILITY = ["low", "moderate", "high"] as const;

export type SoilType = (typeof SOIL_TYPES)[number];
export type IrrigationMethod = (typeof IRRIGATION_METHODS)[number];
export type WaterAvailability = (typeof WATER_AVAILABILITY)[number];

// ──────────────────────────────────────────────
// Interfaces
// ──────────────────────────────────────────────

export interface ICropDetail {
  cropName: string;
  sowingDate: Date;
  growthStage: string;
  pastDiseaseHistory?: boolean;
  averageYieldLastSeason?: number;
}

export interface ILocation {
  state: string;
  district: string;
  villageOrTown: string;
  latitude: number;
  longitude: number;
}

export interface IFarmProfile {
  farmSize: number;
  soilType: SoilType;
  irrigationMethod: IrrigationMethod;
  waterAvailability: WaterAvailability;
}

export interface IUser extends Document {
  uid: string;
  email: string;
  name: string;
  preferredLanguage: string;
  phoneNumber?: string;
  location: ILocation;
  farmProfile: IFarmProfile;
  crops: ICropDetail[];
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ──────────────────────────────────────────────
// Sub-schemas
// ──────────────────────────────────────────────

const CropDetailSchema = new Schema<ICropDetail>(
  {
    cropName: { type: String, required: true, trim: true },
    sowingDate: { type: Date, required: true },
    growthStage: { type: String, trim: true, default: "" },
    pastDiseaseHistory: { type: Boolean, default: false },
    averageYieldLastSeason: { type: Number },
  },
  { _id: true },
);

const LocationSchema = new Schema<ILocation>(
  {
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    villageOrTown: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false },
);

const FarmProfileSchema = new Schema<IFarmProfile>(
  {
    farmSize: { type: Number, required: true },
    soilType: { type: String, enum: SOIL_TYPES, required: true },
    irrigationMethod: {
      type: String,
      enum: IRRIGATION_METHODS,
      required: true,
    },
    waterAvailability: {
      type: String,
      enum: WATER_AVAILABILITY,
      required: true,
    },
  },
  { _id: false },
);

// ──────────────────────────────────────────────
// Main schema
// ──────────────────────────────────────────────

const UserSchema = new Schema<IUser>(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: { type: String, trim: true, default: "" },
    preferredLanguage: { type: String, trim: true, default: "en" },
    phoneNumber: { type: String, trim: true },
    location: { type: LocationSchema },
    farmProfile: { type: FarmProfileSchema },
    crops: { type: [CropDetailSchema], default: [] },
    onboardingCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", UserSchema);
