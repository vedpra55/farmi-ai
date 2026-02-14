import { Request, Response } from "express";
import { User } from "./user.model.js";
import { asyncHandler } from "../../lib/utils/async-handler.js";
import { ApiResponse } from "../../lib/utils/api-response.js";
import { ApiError } from "../../lib/utils/api-error.js";

/**
 * GET /api/user/me
 * Returns the authenticated user's profile, or 404 if not found.
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ uid: req.uid });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  res.status(200).json(ApiResponse.success(user, "User fetched successfully"));
});

/**
 * POST /api/user/onboarding
 * Creates or updates user with onboarding data and sets onboardingCompleted.
 */
export const completeOnboarding = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      preferredLanguage,
      phoneNumber,
      location,
      farmProfile,
      crops,
    } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: req.uid },
      {
        $set: {
          email: req.body.email,
          name,
          preferredLanguage,
          phoneNumber,
          location,
          farmProfile,
          crops,
          onboardingCompleted: true,
        },
        $setOnInsert: {
          uid: req.uid,
        },
      },
      { upsert: true, new: true, runValidators: true },
    );

    res
      .status(200)
      .json(ApiResponse.success(user, "Onboarding completed successfully"));
  },
);
