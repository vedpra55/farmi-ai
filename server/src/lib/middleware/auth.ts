import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { ApiError } from "../utils/api-error.js";

/**
 * Middleware that extracts and validates the Clerk userId from the request,
 * then attaches it as `req.uid`. Must be used AFTER `clerkMiddleware()`.
 */
export const requireAuthWithUser = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw ApiError.unauthorized("Authentication required");
  }

  req.uid = userId;
  next();
};
