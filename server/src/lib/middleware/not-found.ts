import { NextFunction, Request, Response } from "express";
import { ApiError } from "@/lib/utils/api-error.js";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  const error = ApiError.notFound("Route not found");
  next(error);
};
