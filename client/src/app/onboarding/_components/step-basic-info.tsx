"use client";

import { useCallback, useState } from "react";
import { useOnboardingStore } from "../_store/onboarding-store";
import { OnboardingShell } from "./onboarding-shell";
import { LocationPicker } from "./location-picker";
import { Button } from "@/components/ui/button";

export function StepBasicInfo() {
  const store = useOnboardingStore();
  const [detectingLocation, setDetectingLocation] = useState(false);

  const isValid = store.name.trim().length > 0 && store.state.trim().length > 0;

  const handleDetectLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        store.setField("latitude", latitude);
        store.setField("longitude", longitude);

        // Reverse geocode to fill location fields
        try {
          const geocoder = new google.maps.Geocoder();
          const resp = await geocoder.geocode({
            location: { lat: latitude, lng: longitude },
          });

          if (resp.results[0]) {
            const components = resp.results[0].address_components;
            const get = (type: string) =>
              components.find((c) => c.types.includes(type))?.long_name || "";

            store.setField("state", get("administrative_area_level_1"));
            store.setField("district", get("administrative_area_level_2"));
            store.setField(
              "villageOrTown",
              get("sublocality_level_1") ||
                get("locality") ||
                get("administrative_area_level_3"),
            );
          }
        } catch {
          // geocoding failed — user can fill manually
        }
        setDetectingLocation(false);
      },
      () => setDetectingLocation(false),
      { enableHighAccuracy: true },
    );
  }, [store]);

  return (
    <OnboardingShell
      onNext={store.nextStep}
      onBack={store.prevStep}
      nextDisabled={!isValid}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tell us about yourself
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Basic details so we can personalize your experience.
        </p>

        <div className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
              Name
            </label>
            <p className="text-xs text-foreground-muted mb-1.5">
              How should we address you?
            </p>
            <input
              type="text"
              value={store.name}
              onChange={(e) => store.setField("name", e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
              Phone{" "}
              <span className="text-foreground-muted font-normal">
                (optional)
              </span>
            </label>
            <p className="text-xs text-foreground-muted mb-1.5">
              For SMS alerts about weather and crop health
            </p>
            <input
              type="tel"
              value={store.phoneNumber}
              onChange={(e) => store.setField("phoneNumber", e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
            />
          </div>

          {/* Location Section */}
          <div className="border-t border-border pt-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-foreground">
                Your Location
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDetectLocation}
                isLoading={detectingLocation}
              >
                📍 Detect location
              </Button>
            </div>
            <p className="text-xs text-foreground-muted mb-4">
              Needed for weather data and regional crop recommendations
            </p>

            {/* Map */}
            {store.latitude !== 0 && store.longitude !== 0 && (
              <div className="mb-4">
                <LocationPicker />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  State
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  Needed for weather and regional crop data
                </p>
                <input
                  type="text"
                  value={store.state}
                  onChange={(e) => store.setField("state", e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  District
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  Helps us find district-level soil and market info
                </p>
                <input
                  type="text"
                  value={store.district}
                  onChange={(e) => store.setField("district", e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-0.5">
                  Village / Town
                </label>
                <p className="text-xs text-foreground-muted mb-1.5">
                  Your nearest town for local weather accuracy
                </p>
                <input
                  type="text"
                  value={store.villageOrTown}
                  onChange={(e) =>
                    store.setField("villageOrTown", e.target.value)
                  }
                  placeholder="e.g. Baramati"
                  className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-ring focus:ring-1 focus:ring-ring outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
