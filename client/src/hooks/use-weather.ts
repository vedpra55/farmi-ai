import { useState, useEffect, useCallback } from "react";
import { CurrentConditionsResponse } from "@/types/weather";
import { fetchCurrentWeather } from "@/services/weather-service";
import { useUserStore } from "@/store/user-store";

const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

interface UseWeatherReturn {
  weather: CurrentConditionsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather(): UseWeatherReturn {
  const user = useUserStore((s) => s.user);
  const lat = user?.location?.latitude;
  const lng = user?.location?.longitude;

  const [weather, setWeather] = useState<CurrentConditionsResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!lat || !lng) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCurrentWeather(lat, lng);
      setWeather(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch weather";
      setError(message);
      console.error("Weather fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng]);

  // Fetch on mount + when location changes
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    if (!lat || !lng) return;

    const interval = setInterval(fetchWeather, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchWeather, lat, lng]);

  return { weather, isLoading, error, refetch: fetchWeather };
}
