import { useState, useCallback } from "react";

export interface LocationData {
  latitude: number;
  longitude: number;
  state: string;
  district: string;
  villageOrTown: string;
}

export function useLocation() {
  const [detecting, setDetecting] = useState(false);

  const detectLocation = useCallback(
    async (onSuccess: (data: LocationData) => void, onError?: () => void) => {
      if (!navigator.geolocation) {
        onError?.();
        return;
      }

      setDetecting(true);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const geocoder = new google.maps.Geocoder();
            const resp = await geocoder.geocode({
              location: { lat: latitude, lng: longitude },
            });

            if (resp.results[0]) {
              const components = resp.results[0].address_components;
              const get = (type: string) =>
                components.find((c) => c.types.includes(type))?.long_name || "";

              const data: LocationData = {
                latitude,
                longitude,
                state: get("administrative_area_level_1"),
                district: get("administrative_area_level_2"),
                villageOrTown:
                  get("sublocality_level_1") ||
                  get("locality") ||
                  get("administrative_area_level_3"),
              };

              onSuccess(data);
            } else {
              // If geocoding fails but we have coords
              onSuccess({
                latitude,
                longitude,
                state: "",
                district: "",
                villageOrTown: "",
              });
            }
          } catch (error) {
            console.error("Geocoding failed", error);
            // If geocoding completely fails but we have coords
            onSuccess({
              latitude,
              longitude,
              state: "",
              district: "",
              villageOrTown: "",
            });
          } finally {
            setDetecting(false);
          }
        },
        (error) => {
          console.error("Geolocation failed", error);
          setDetecting(false);
          onError?.();
        },
        { enableHighAccuracy: true },
      );
    },
    [],
  );

  return { detecting, detectLocation };
}
