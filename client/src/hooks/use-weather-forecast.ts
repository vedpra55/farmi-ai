import { useState, useEffect, useCallback } from "react";
import { ForecastResponse } from "@/types/weather";
import { fetchWeatherForecast } from "@/services/weather-service";
import { useUserStore } from "@/store/user-store";
import { useAuth } from "@clerk/nextjs";

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour

interface UseWeatherForecastReturn {
  forecast: ForecastResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeatherForecast(): UseWeatherForecastReturn {
  const user = useUserStore((s) => s.user);
  const lat = user?.location?.latitude;
  const lng = user?.location?.longitude;

  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchForecast = useCallback(async () => {
    if (!lat || !lng) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const data = await fetchWeatherForecast(lat, lng, token);
      setForecast(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch weather forecast";
      setError(message);
      console.error("Weather forecast fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (!forecast) {
      fetchForecast();
    }
  }, [fetchForecast]);

  // Auto-refresh every hour
  useEffect(() => {
    if (!lat || !lng) return;

    const interval = setInterval(fetchForecast, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchForecast, lat, lng]);

  return { forecast, isLoading, error, refetch: fetchForecast };
}
