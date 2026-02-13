import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import { env } from "@/lib/config/env.js";
import { errorHandler } from "@/lib/middleware/error-handler.js";
import { ApiResponse } from "@/lib/utils/api-response.js";
import { notFound } from "@/lib/middleware/not-found.js";
import userRoutes from "@/features/user/user.routes.js";

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(clerkMiddleware());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.status(200).json(ApiResponse.success(null, "Server is healthy"));
  });

  // Routes
  app.use("/api/user", userRoutes);

  // 404 Handler
  app.use(notFound);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
