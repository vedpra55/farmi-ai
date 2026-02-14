"use client";

import { useWeatherForecast } from "@/hooks/use-weather-forecast";
import { WeatherForecastGraph } from "./_components/WeatherForecastGraph";
import {
  Loader2,
  AlertCircle,
  CalendarDays,
  Droplets,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function WeatherPage() {
  const t = useTranslations("Weather");
  const { forecast, isLoading, error } = useWeatherForecast();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <h5 className="font-medium leading-none tracking-tight">
              {t("errorTitle")}
            </h5>
            <div className="text-sm opacity-90">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-in p-8 fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {forecast && (
        <div className="grid gap-8">
          {/* Main Graph */}
          <section>
            <WeatherForecastGraph forecast={forecast} />
          </section>

          {/* Daily Cards Grid */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h2>{t("dailyBreakdown")}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {forecast.dailyForecasts.map((day, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-none shadow-md bg-surface/50  backdrop-blur-sm transition-all hover:shadow-lg"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4">
                      {/* Header: Day & Icon */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{day.dayOfWeek}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {day.weatherCondition.description.text}
                          </p>
                        </div>
                        {/* We could add an icon/image here if available in the API response */}
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                      </div>

                      {/* Temps */}
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold tracking-tighter">
                          {Math.round(day.temperature.max.degrees)}°
                        </span>
                        <div className="flex flex-col text-sm text-muted-foreground mb-1">
                          <span className="flex items-center gap-1 text-orange-500">
                            <ArrowUp className="h-3 w-3" /> {t("max")}
                          </span>
                        </div>
                        <div className="flex flex-col text-sm text-muted-foreground mb-1 ml-2">
                          <span className="text-4xl font-bold tracking-tighter text-muted-foreground/50">
                            /
                          </span>
                        </div>
                        <span className="text-2xl font-semibold text-muted-foreground/80 mb-1 ml-1">
                          {Math.round(day.temperature.min.degrees)}°
                        </span>
                        <div className="flex flex-col text-sm text-muted-foreground mb-1">
                          <span className="flex items-center gap-1 text-blue-500">
                            <ArrowDown className="h-3 w-3" /> {t("min")}
                          </span>
                        </div>
                      </div>

                      {/* Rain Probability */}
                      {day.precipitationProbability > 0 && (
                        <div className="flex items-center gap-2 mt-1 rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 w-fit">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {t("rainLabel", {
                              value: day.precipitationProbability,
                            })}
                          </span>
                        </div>
                      )}

                      {day.precipitationProbability === 0 && (
                        <div className="flex items-center gap-2 mt-1 px-3 py-1.5 w-fit">
                          <span className="text-sm text-muted-foreground">
                            {t("noRain")}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
