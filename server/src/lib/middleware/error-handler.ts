import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/lib/utils/api-error.js";
import { ApiResponse } from "@/lib/utils/api-response.js";
import { logger } from "@/lib/utils/logger.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error as ApiError;

  logger.error(message, {
    statusCode,
    stack: (error as ApiError).stack,
    path: req.path,
    method: req.method,
  });

  const response = ApiResponse.error(message, statusCode);

  res.status(statusCode).json(response);
};
