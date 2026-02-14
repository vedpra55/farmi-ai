"use client";

import { ForecastResponse } from "@/types/weather";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, Sun, Calendar } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface WeatherForecastGraphProps {
  forecast: ForecastResponse;
}

export function WeatherForecastGraph({ forecast }: WeatherForecastGraphProps) {
  const t = useTranslations("Weather.graph");
  const locale = useLocale();
  const weekdayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const data = forecast.dailyForecasts.map((day) => {
    const date = new Date(
      day.forecastDate.year,
      day.forecastDate.month - 1,
      day.forecastDate.day,
    );
    return {
      name: weekdayFormatter.format(date),
      date: dateFormatter.format(date),
      minTemp: day.temperature.min.degrees,
      maxTemp: day.temperature.max.degrees,
      rainChance: day.precipitationProbability,
      condition: day.weatherCondition.description.text,
    };
  });

  return (
    <Card className="w-full border-0 bg-surface/50 backdrop-blur-lg shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">{t("title")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#88888840"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].payload.date}
                          </span>
                          <span className="font-bold text-lg">
                            {payload[0].payload.condition}
                          </span>
                          <div className="flex items-center gap-2 text-sm text-[#f59e0b]">
                            <Sun className="h-3 w-3" />
                            {t("high")}: {payload[0].value}°
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#3b82f6]">
                            <Sun className="h-3 w-3" />
                            {t("low")}: {payload[1].value}°
                          </div>
                          <div className="flex items-center gap-2 text-sm text-blue-500">
                            <CloudRain className="h-3 w-3" />
                            {t("rain")}: {payload[0].payload.rainChance}%
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="maxTemp"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorMax)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="minTemp"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorMin)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
