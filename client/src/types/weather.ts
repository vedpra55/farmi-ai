// ──────────────────────────────────────────────
// Google Weather API — Current Conditions Types
// ──────────────────────────────────────────────

export interface WeatherDescription {
  text: string;
  languageCode: string;
}

export interface WeatherCondition {
  iconBaseUri: string;
  description: WeatherDescription;
  type: string;
}

export interface TemperatureValue {
  degrees: number;
  unit: string;
}

export interface WindDirection {
  degrees: number;
  cardinal: string;
}

export interface WindSpeed {
  value: number;
  unit: string;
}

export interface Wind {
  direction: WindDirection;
  speed: WindSpeed;
  gust: WindSpeed;
}

export interface PrecipitationProbability {
  percent: number;
  type: string;
}

export interface PrecipitationQPF {
  quantity: number;
  unit: string;
}

export interface Precipitation {
  probability: PrecipitationProbability;
  qpf: PrecipitationQPF;
}

export interface CurrentConditionsHistory {
  temperatureChange: TemperatureValue;
  maxTemperature: TemperatureValue;
  minTemperature: TemperatureValue;
  qpf: PrecipitationQPF;
}

export interface CurrentConditionsResponse {
  currentTime: string;
  timeZone: { id: string };
  isDaytime: boolean;
  weatherCondition: WeatherCondition;
  temperature: TemperatureValue;
  feelsLikeTemperature: TemperatureValue;
  dewPoint: TemperatureValue;
  heatIndex: TemperatureValue;
  windChill: TemperatureValue;
  relativeHumidity: number;
  uvIndex: number;
  precipitation: Precipitation;
  thunderstormProbability: number;
  airPressure: { meanSeaLevelMillibars: number };
  wind: Wind;
  visibility: { distance: number; unit: string };
  cloudCover: number;
  currentConditionsHistory: CurrentConditionsHistory;
}

// ──────────────────────────────────────────────
// Google Weather API — Forecast Types
// ──────────────────────────────────────────────

export interface HourlyForecast {
  forecastTime: string;
  temperature: TemperatureValue;
  feelsLikeTemperature: TemperatureValue;
  humidity: number;
  precipitationProbability: number;
  precipitation: asPrecipitation;
  wind: Wind;
  weatherCondition: WeatherCondition;
}

interface asPrecipitation {
  probability: number;
  amount?: number;
}

export interface DailyForecast {
  forecastDate: {
    year: number;
    month: number;
    day: number;
  };
  dayOfWeek: string;
  temperature: {
    min: TemperatureValue;
    max: TemperatureValue;
  };
  precipitationProbability: number;
  weatherCondition: WeatherCondition;
  sunrise: string;
  sunset: string;
}

export interface ForecastResponse {
  dailyForecasts: DailyForecast[];
  hourlyForecasts: HourlyForecast[];
}
