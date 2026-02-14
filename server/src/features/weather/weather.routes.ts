import { Router } from "express";
import { requireAuthWithUser } from "@/lib/middleware/auth.js";
import {
  getCurrentWeather,
  getWeatherForecast,
} from "@/features/weather/weather.controller.js";

const router = Router();

// Protect weather routes
router.use(requireAuthWithUser);

router.get("/current", getCurrentWeather);
router.get("/forecast", getWeatherForecast);

export default router;
