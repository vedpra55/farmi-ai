import { Request, Response } from "express";
import axios from "axios";
import { asyncHandler } from "../../lib/utils/async-handler.js";
import { ApiResponse } from "../../lib/utils/api-response.js";
import { ApiError } from "../../lib/utils/api-error.js";

const WEATHER_API_BASE = "https://weather.googleapis.com/v1";
// Use GOOGLE_WEATHER_API_KEY or fall back to Maps key
const API_KEY =
  process.env.GOOGLE_WEATHER_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

export const getCurrentWeather = asyncHandler(
  async (req: Request, res: Response) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      throw ApiError.badRequest("Latitude and longitude are required");
    }

    if (!API_KEY) {
      throw ApiError.internal("Weather API key not configured");
    }

    try {
      const url = `${WEATHER_API_BASE}/currentConditions:lookup?key=${API_KEY}&location.latitude=${lat}&location.longitude=${lng}`;
      const response = await axios.get(url);
      res
        .status(200)
        .json(ApiResponse.success(response.data, "Current weather fetched"));
    } catch (error: any) {
      console.error(
        "Weather API Error:",
        error.response?.data || error.message,
      );
      throw ApiError.internal("Failed to fetch current weather");
    }
  },
);

export const getWeatherForecast = asyncHandler(
  async (req: Request, res: Response) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      throw ApiError.badRequest("Latitude and longitude are required");
    }

    if (!API_KEY) {
      throw ApiError.internal("Weather API key not configured");
    }

    try {
      const url = `${WEATHER_API_BASE}/forecast/days:lookup?key=${API_KEY}&location.latitude=${lat}&location.longitude=${lng}&days=7&pageSize=7`;
      const response = await axios.get(url);

      // Map API response to our frontend ForecastResponse interface
      const apiData = response.data;
      const dailyForecasts = (apiData.forecastDays || []).map((day: any) => {
        const date = new Date(
          day.displayDate.year,
          day.displayDate.month - 1,
          day.displayDate.day,
        );
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

        return {
          forecastDate: day.displayDate,
          dayOfWeek,
          temperature: {
            min: day.minTemperature,
            max: day.maxTemperature,
          },
          precipitationProbability:
            day.daytimeForecast?.precipitation?.probability?.percent || 0,
          weatherCondition: day.daytimeForecast?.weatherCondition,
          sunrise: day.sunEvents?.sunriseTime,
          sunset: day.sunEvents?.sunsetTime,
        };
      });

      const mappedResponse = {
        dailyForecasts,
        hourlyForecasts: [], // We are not fetching hourly yet
      };

      res
        .status(200)
        .json(ApiResponse.success(mappedResponse, "Weather forecast fetched"));
    } catch (error: any) {
      console.error(
        "Weather Forecast API Error:",
        error.response?.data || error.message,
      );
      throw ApiError.internal("Failed to fetch weather forecast");
    }
  },
);
