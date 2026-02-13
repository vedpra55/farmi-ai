"use client";

import { useCallback, useRef } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { useOnboardingStore } from "../_store/onboarding-store";

const MAP_STYLES = {
  width: "100%",
  height: "200px",
  borderRadius: "12px",
};

const MAP_OPTIONS: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: "greedy",
  styles: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export function LocationPicker() {
  const { latitude, longitude, setField } = useOnboardingStore();
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerDragEnd = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (!lat || !lng) return;

      setField("latitude", lat);
      setField("longitude", lng);

      // Reverse geocode
      try {
        const geocoder = new google.maps.Geocoder();
        const resp = await geocoder.geocode({
          location: { lat, lng },
        });

        if (resp.results[0]) {
          const components = resp.results[0].address_components;
          const get = (type: string) =>
            components.find((c) => c.types.includes(type))?.long_name || "";

          setField("state", get("administrative_area_level_1"));
          setField("district", get("administrative_area_level_2"));
          setField(
            "villageOrTown",
            get("sublocality_level_1") ||
              get("locality") ||
              get("administrative_area_level_3"),
          );
        }
      } catch {
        // silent fail — user can edit manually
      }
    },
    [setField],
  );

  if (!isLoaded) {
    return (
      <div
        className="w-full rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-foreground-muted text-sm"
        style={{ height: "200px" }}
      >
        Loading map…
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={MAP_STYLES}
      center={{ lat: latitude, lng: longitude }}
      zoom={14}
      onLoad={onMapLoad}
      options={MAP_OPTIONS}
    >
      <MarkerF
        position={{ lat: latitude, lng: longitude }}
        draggable
        onDragEnd={handleMarkerDragEnd}
      />
    </GoogleMap>
  );
}
