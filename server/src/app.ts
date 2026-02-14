import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./lib/config/env.js";
import { errorHandler } from "./lib/middleware/error-handler.js";
import { ApiResponse } from "./lib/utils/api-response.js";
import { notFound } from "./lib/middleware/not-found.js";
import userRoutes from "./features/user/user.routes.js";
import cropRoutes from "./features/crop/crop.routes.js";
import assistantRoutes from "./features/assistant/assistant.routes.js";
import diseaseRoutes from "./features/disease/disease.routes.js";
import weatherRoutes from "./features/weather/weather.routes.js";
import { connectToDB } from "./lib/database/mongoose.js";

const app = express();

// Security middleware (cast to any to avoid Vercel build type error)
app.use((helmet as any)());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());
app.use(clerkMiddleware());

// Database connection middleware
app.use(async (_req, res, next) => {
  try {
    await connectToDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json(ApiResponse.success(null, "Server is healthy"));
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/user/crops", cropRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/weather", weatherRoutes);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;
