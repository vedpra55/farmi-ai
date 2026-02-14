"use client";

import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  Sun,
} from "lucide-react";
import { useWeather } from "@/hooks/use-weather";
import { useTranslations } from "next-intl";

/**
 * Map Google Weather condition types to Lucide icons.
 */
function getWeatherIcon(type?: string) {
  switch (type) {
    case "CLEAR":
      return Sun;
    case "RAIN":
    case "HEAVY_RAIN":
    case "SHOWERS":
      return CloudRain;
    case "WIND":
      return Wind;
    default:
      return CloudSun;
  }
}

/**
 * Generate a farming tip based on weather conditions.
 */
function getFarmingTip(
  temp?: number,
  humidity?: number,
  rainProbability?: number,
  t?: (key: string) => string,
): string {
  if (rainProbability && rainProbability > 60) {
    return (
      t?.("tips.rainHigh") ??
      "Rain expected — hold off irrigation and secure loose materials."
    );
  }
  if (temp && temp > 38) {
    return (
      t?.("tips.heat") ??
      "Extreme heat — ensure crops are well-watered and mulched."
    );
  }
  if (humidity && humidity > 80) {
    return (
      t?.("tips.humidity") ??
      "High humidity — watch for fungal diseases on leaves."
    );
  }
  if (rainProbability && rainProbability > 30) {
    return (
      t?.("tips.rainLight") ??
      "Light rain possible — good day for fertiliser application."
    );
  }
  if (temp && temp < 10) {
    return (
      t?.("tips.cold") ??
      "Cold conditions — protect tender seedlings from frost."
    );
  }
  return t?.("tips.good") ?? "Good conditions for field work today.";
}

export function WeatherSnapshot() {
  const t = useTranslations("DashboardHome.weather");
  const { weather, isLoading, error } = useWeather();

  // Loading skeleton
  if (isLoading && !weather) {
    return (
      <div className="bg-background border border-border rounded-xl p-6 shadow-sm animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-secondary rounded" />
            <div className="h-10 w-20 bg-secondary rounded" />
            <div className="h-3 w-28 bg-secondary rounded" />
          </div>
          <div className="w-14 h-14 bg-secondary rounded-full" />
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-3 w-full bg-secondary rounded" />
          <div className="h-px bg-border w-full" />
          <div className="h-3 w-3/4 bg-secondary rounded" />
        </div>
      </div>
    );
  }

  // Error state — show card with fallback
  if (error && !weather) {
    return (
      <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {t("title")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("loadError")}
            </p>
          </div>
          <div className="bg-secondary p-3 rounded-full text-muted-foreground">
            <CloudSun className="w-8 h-8" />
          </div>
        </div>
      </div>
    );
  }

  const temp = weather?.temperature?.degrees;
  const condition = weather?.weatherCondition?.description?.text || "—";
  const humidity = weather?.relativeHumidity;
  const rainChance = weather?.precipitation?.probability?.percent;
  const windSpeed = weather?.wind?.speed?.value;
  const WeatherIcon = getWeatherIcon(weather?.weatherCondition?.type);
  const tip = getFarmingTip(temp, humidity, rainChance, t);

  return (
    <div className="bg-background border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between group hover:border-info/30 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {t("title")}
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-4xl font-bold text-foreground">
              {temp !== undefined ? Math.round(temp) : "—"}°
            </h3>
            <span className="text-lg text-muted-foreground">C</span>
          </div>
          <p className="text-sm text-foreground font-medium mt-1">
            {condition}
          </p>
        </div>

        {/* Weather icon from Google or fallback Lucide icon */}
        {weather?.weatherCondition?.iconBaseUri ? (
          <div className="bg-info/10 p-2 rounded-full">
            <img
              src={`${weather.weatherCondition.iconBaseUri}.svg`}
              alt={condition}
              className="w-10 h-10"
            />
          </div>
        ) : (
          <div className="bg-info/10 p-3 rounded-full text-info">
            <WeatherIcon className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Droplets className="w-3.5 h-3.5" />
            <span>{humidity ?? "—"}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CloudRain className="w-3.5 h-3.5" />
            <span>{rainChance ?? 0}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Thermometer className="w-3.5 h-3.5" />
            <span>
              {weather?.feelsLikeTemperature?.degrees !== undefined
                ? `${Math.round(weather.feelsLikeTemperature.degrees)}°`
                : "—"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("labels.humidity")}</span>
          <span>{t("labels.rain")}</span>
          <span>{t("labels.feelsLike")}</span>
        </div>

        <div className="h-px bg-border w-full" />

        {/* Farming tip */}
        <p className="text-xs text-info font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse inline-block shrink-0" />
          {tip}
        </p>
      </div>
    </div>
  );
}
