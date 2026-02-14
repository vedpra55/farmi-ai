import { Request, Response } from "express";
import { streamText, convertToModelMessages, UIMessage } from "ai";
import { GoogleGenAI, Modality } from "@google/genai";
import { User } from "@/features/user/user.model.js";
import { Conversation } from "@/features/assistant/conversation.model.js";
import { buildSystemPrompt } from "@/features/assistant/build-system-prompt.js";
import { asyncHandler } from "@/lib/utils/async-handler.js";
import { ApiResponse } from "@/lib/utils/api-response.js";
import { ApiError } from "@/lib/utils/api-error.js";
import { google } from "@ai-sdk/google";

// ──────────────────────────────────────────────
// POST /api/assistant/chat
// Streaming text chat using Groq via Vercel AI SDK
// ──────────────────────────────────────────────

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const { messages, conversationId, locale } = req.body as {
    messages: UIMessage[];
    conversationId?: string;
    locale?: string;
  };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw ApiError.badRequest("messages array is required");
  }

  // Load user profile for context
  const user = await User.findOne({ uid: req.uid });
  if (!user) {
    throw ApiError.notFound("User not found. Complete onboarding first.");
  }

  // Build personalized system prompt
  const systemPrompt = buildSystemPrompt(user, locale);

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  });

  const saveConversation = async () => {
    try {
      const fullText = await result.text;

      // Get the last user message
      // Get the last user message
      const lastUserMessage = messages[messages.length - 1];

      // Map parts to match our schema
      const userMessageParts = lastUserMessage.parts.map((p: any) => {
        if (p.type === "text") {
          return { type: "text", text: p.text };
        } else if (p.type === "image") {
          // p.image can be a URL or base64 string
          // For now we store it as is. In a production app, we should upload to S3/Cloudinary and store the URL.
          return { type: "image", image: p.image, mimeType: p.mimeType };
        }
        return { type: "text", text: "" }; // Fallback
      });

      if (conversationId) {
        // Append to existing conversation
        await Conversation.findOneAndUpdate(
          { _id: conversationId, uid: req.uid },
          {
            $push: {
              messages: {
                $each: [
                  {
                    id: lastUserMessage.id,
                    role: "user" as const,
                    parts: userMessageParts,
                    createdAt: new Date(),
                  },
                  {
                    id: `assistant-${Date.now()}`,
                    role: "assistant" as const,
                    parts: [{ type: "text" as const, text: fullText }],
                    createdAt: new Date(),
                  },
                ],
              },
            },
          },
        );
      } else {
        // Create a new conversation — title from first user message
        const firstTextPart = userMessageParts.find(
          (p: any) => p.type === "text",
        );
        const title = firstTextPart?.text?.slice(0, 80) || "New Conversation";

        await Conversation.create({
          uid: req.uid,
          title,
          messages: [
            {
              id: lastUserMessage.id,
              role: "user" as const,
              parts: userMessageParts,
              createdAt: new Date(),
            },
            {
              id: `assistant-${Date.now()}`,
              role: "assistant" as const,
              parts: [{ type: "text" as const, text: fullText }],
              createdAt: new Date(),
            },
          ],
        });
      }
    } catch (err) {
      console.error("Failed to save conversation:", err);
    }
  };

  // Fire-and-forget: save runs after stream completes
  saveConversation();

  // Pipe the stream to the response
  result.pipeUIMessageStreamToResponse(res);
});

// ──────────────────────────────────────────────
// POST /api/assistant/voice-token
// Generate ephemeral token for Gemini Live API
// ──────────────────────────────────────────────

export const getVoiceToken = asyncHandler(
  async (req: Request, res: Response) => {
    // Load user profile for system instruction
    const user = await User.findOne({ uid: req.uid });
    if (!user) {
      throw ApiError.notFound("User not found. Complete onboarding first.");
    }

    const systemInstruction = buildSystemPrompt(user);

    // Initialize Google GenAI with v1alpha for ephemeral tokens
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      httpOptions: { apiVersion: "v1alpha" },
    });

    // Create ephemeral token with constraints
    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        liveConnectConstraints: {
          model: "gemini-2.5-flash-native-audio-preview-12-2025",
          config: {
            sessionResumption: {},
            temperature: 0.7,
            responseModalities: [Modality.AUDIO],
            systemInstruction,
          },
        },
      },
    });

    res.status(200).json(
      ApiResponse.success(
        {
          token: token.name,
          model: "gemini-2.5-flash-native-audio-preview-12-2025",
          expiresAt: expireTime,
        },
        "Voice token generated",
      ),
    );
  },
);

// ──────────────────────────────────────────────
// GET /api/assistant/conversations
// List all conversations for the user
// ──────────────────────────────────────────────

export const getConversations = asyncHandler(
  async (req: Request, res: Response) => {
    const conversations = await Conversation.find({ uid: req.uid })
      .select("title createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    res
      .status(200)
      .json(ApiResponse.success(conversations, "Conversations fetched"));
  },
);

// ──────────────────────────────────────────────
// GET /api/assistant/conversations/:conversationId
// Get a single conversation with all messages
// ──────────────────────────────────────────────

export const getConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      uid: req.uid,
    }).lean();

    if (!conversation) {
      throw ApiError.notFound("Conversation not found");
    }

    res
      .status(200)
      .json(ApiResponse.success(conversation, "Conversation fetched"));
  },
);

// ──────────────────────────────────────────────
// DELETE /api/assistant/conversations/:conversationId
// Delete a conversation
// ──────────────────────────────────────────────

export const deleteConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const { conversationId } = req.params;

    const result = await Conversation.findOneAndDelete({
      _id: conversationId,
      uid: req.uid,
    });

    if (!result) {
      throw ApiError.notFound("Conversation not found");
    }

    res.status(200).json(ApiResponse.success(null, "Conversation deleted"));
  },
);
