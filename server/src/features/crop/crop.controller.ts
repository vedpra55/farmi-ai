import mongoose from "mongoose";
import { Request, Response } from "express";
import { User } from "../user/user.model.js";
import { asyncHandler } from "../../lib/utils/async-handler.js";
import { ApiResponse } from "../../lib/utils/api-response.js";
import { ApiError } from "../../lib/utils/api-error.js";

/**
 * POST /api/user/crops
 * Add a new crop to the user's crops array.
 * Explicitly generates _id so it's always persisted.
 */
export const addCrop = asyncHandler(async (req: Request, res: Response) => {
  const {
    cropName,
    sowingDate,
    growthStage,
    pastDiseaseHistory,
    averageYieldLastSeason,
  } = req.body;

  if (!cropName || !sowingDate) {
    throw ApiError.badRequest("cropName and sowingDate are required");
  }

  // Use $push with an explicit _id so it's always persisted in MongoDB
  const newCropId = new mongoose.Types.ObjectId();

  const user = await User.findOneAndUpdate(
    { uid: req.uid },
    {
      $push: {
        crops: {
          _id: newCropId,
          cropName,
          sowingDate,
          growthStage: growthStage || "",
          pastDiseaseHistory: pastDiseaseHistory || false,
          averageYieldLastSeason,
        },
      },
    },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  res.status(201).json(ApiResponse.success(user, "Crop added successfully"));
});

/**
 * PUT /api/user/crops/:cropId
 * Update a specific crop by its _id using positional $ operator.
 */
export const updateCrop = asyncHandler(async (req: Request, res: Response) => {
  const { cropId } = req.params;
  const {
    cropName,
    sowingDate,
    growthStage,
    pastDiseaseHistory,
    averageYieldLastSeason,
  } = req.body;

  if (!cropId) {
    throw ApiError.badRequest("cropId is required");
  }

  // Build $set fields dynamically — only update what was sent
  const updateFields: Record<string, any> = {};
  if (cropName !== undefined) updateFields["crops.$.cropName"] = cropName;
  if (sowingDate !== undefined) updateFields["crops.$.sowingDate"] = sowingDate;
  if (growthStage !== undefined)
    updateFields["crops.$.growthStage"] = growthStage;
  if (pastDiseaseHistory !== undefined)
    updateFields["crops.$.pastDiseaseHistory"] = pastDiseaseHistory;
  if (averageYieldLastSeason !== undefined)
    updateFields["crops.$.averageYieldLastSeason"] = averageYieldLastSeason;

  if (Object.keys(updateFields).length === 0) {
    throw ApiError.badRequest("No fields to update");
  }

  const user = await User.findOneAndUpdate(
    {
      uid: req.uid,
      "crops._id": new mongoose.Types.ObjectId(cropId as string),
    },
    { $set: updateFields },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw ApiError.notFound("Crop not found");
  }

  res.status(200).json(ApiResponse.success(user, "Crop updated successfully"));
});

/**
 * DELETE /api/user/crops/:cropId
 * Remove a crop from the user's crops array by _id.
 */
export const deleteCrop = asyncHandler(async (req: Request, res: Response) => {
  const { cropId } = req.params;

  if (!cropId) {
    throw ApiError.badRequest("cropId is required");
  }

  const user = await User.findOneAndUpdate(
    { uid: req.uid },
    {
      $pull: { crops: { _id: new mongoose.Types.ObjectId(cropId as string) } },
    },
    { new: true },
  );

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  res.status(200).json(ApiResponse.success(user, "Crop deleted successfully"));
});
