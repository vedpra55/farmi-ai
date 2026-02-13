"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

interface OnboardingPayload {
  name: string;
  preferredLanguage: string;
  phoneNumber: string;
  location: {
    state: string;
    district: string;
    villageOrTown: string;
    latitude: number;
    longitude: number;
  };
  farmProfile: {
    farmSize: number;
    soilType: string;
    irrigationMethod: string;
    waterAvailability: string;
  };
  crops: {
    cropName: string;
    sowingDate: string;
    growthStage: string;
    pastDiseaseHistory: boolean;
    averageYieldLastSeason?: number;
  }[];
}

export async function completeOnboarding(data: OnboardingPayload) {
  const { userId, getToken } = await auth();

  if (!userId) {
    return { error: "Not authenticated" };
  }

  try {
    // 1. POST to Express server
    const token = await getToken();
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

    const resp = await fetch(`${serverUrl}/api/user/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      const body = await resp.json().catch(() => ({}));
      return { error: body.message || "Failed to save onboarding data" };
    }

    // 2. Update Clerk publicMetadata
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });

    return { message: "Onboarding completed successfully" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
