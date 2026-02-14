import { Request, Response } from "express";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { ApiError } from "../../lib/utils/api-error.js";
import { ApiResponse } from "../../lib/utils/api-response.js";
import { asyncHandler } from "../../lib/utils/async-handler.js";
import { DiseaseScan } from "./disease.model.js";
import { User } from "../user/user.model.js";
import { DiseaseAnalysisSchema, buildDiseasePrompt } from "./disease.prompt.js";

const MODEL_ID = "gemini-1.5-flash";
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi",
};

const parseImageInput = (
  imageBase64: string,
  mimeType?: string,
): { data: string; mimeType: string } => {
  if (imageBase64.startsWith("data:")) {
    const match = imageBase64.match(/^data:(.+);base64,(.*)$/);
    if (!match) {
      throw ApiError.badRequest("Invalid image data URL");
    }
    return { mimeType: match[1], data: match[2] };
  }

  if (!mimeType) {
    throw ApiError.badRequest("mimeType is required when sending raw base64");
  }

  return { mimeType, data: imageBase64 };
};

export const analyzeDisease = asyncHandler(
  async (req: Request, res: Response) => {
    const { imageBase64, mimeType, language, cropHint, notes } = req.body as {
      imageBase64?: string;
      mimeType?: string;
      language?: string;
      cropHint?: string;
      notes?: string;
    };

    if (!imageBase64) {
      throw ApiError.badRequest("imageBase64 is required");
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw ApiError.internal("Missing GOOGLE_GENERATIVE_AI_API_KEY");
    }

    const user = await User.findOne({ uid: req.uid });
    if (!user) {
      throw ApiError.notFound("User not found. Complete onboarding first.");
    }

    const { data, mimeType: resolvedMimeType } = parseImageInput(
      imageBase64,
      mimeType,
    );

    const approxBytes = Math.floor(data.length * 0.75);
    if (approxBytes > MAX_IMAGE_BYTES) {
      throw ApiError.badRequest("Image is too large. Max 6MB.");
    }

    const languageCode = (
      language ||
      user.preferredLanguage ||
      "en"
    ).toLowerCase();
    const languageName = LANGUAGE_MAP[languageCode] || languageCode;

    const prompt = buildDiseasePrompt({
      user,
      languageName,
      cropHint,
      notes,
    });

    const { object: analysis } = await generateObject({
      model: google("gemini-3-flash-preview"),
      schema: DiseaseAnalysisSchema,
      // prompt property removed as we are using messages for multimodal input
      messages: [
        {
          role: "user" as const,
          content: [
            { type: "text" as const, text: prompt },
            {
              type: "image" as const,
              image: `data:${resolvedMimeType};base64,${data}`,
            },
          ],
        },
      ],
    });

    const scan = await DiseaseScan.create({
      uid: req.uid,
      image: {
        data,
        mimeType: resolvedMimeType,
      },
      analysis,
      language: languageCode,
      cropHint,
      notes,
      model: MODEL_ID,
    });

    res
      .status(200)
      .json(ApiResponse.success(scan, "Disease analysis completed"));
  },
);

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const scans = await DiseaseScan.find({ uid: req.uid })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.status(200).json(ApiResponse.success(scans, "Disease history fetched"));
});
