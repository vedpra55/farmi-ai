import { Router } from "express";
import { requireAuthWithUser } from "@/lib/middleware/auth.js";
import {
  chat,
  getVoiceToken,
  getConversations,
  getConversation,
  deleteConversation,
} from "@/features/assistant/assistant.controller.js";

const router = Router();

// All assistant routes require authentication
router.use(requireAuthWithUser);

// Chat
router.post("/chat", chat);

// Voice
router.post("/voice-token", getVoiceToken);

// Conversations
router.get("/conversations", getConversations);
router.get("/conversations/:conversationId", getConversation);
router.delete("/conversations/:conversationId", deleteConversation);

export default router;
