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

export interface ICropDetail {
  _id?: string;
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

export interface IUser {
  _id: string;
  uid: string;
  email: string;
  name: string;
  preferredLanguage: string;
  phoneNumber?: string;
  location: ILocation;
  farmProfile: IFarmProfile;
  crops: ICropDetail[];
  onboardingCompleted: boolean;
  createdAt: string; // Dates are strings in JSON response
  updatedAt: string;
}
