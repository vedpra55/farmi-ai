import mongoose, { Schema, Document } from "mongoose";

// ──────────────────────────────────────────────
// Interfaces
// ──────────────────────────────────────────────

export interface IMessagePart {
  type: "text" | "image";
  text?: string;
  image?: string;
  mimeType?: string;
}

export interface IMessage {
  id: string;
  role: "user" | "assistant";
  parts: IMessagePart[];
  createdAt: Date;
}

export interface IConversation extends Document {
  uid: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// ──────────────────────────────────────────────
// Sub-schemas
// ──────────────────────────────────────────────

const MessagePartSchema = new Schema<IMessagePart>(
  {
    type: { type: String, enum: ["text", "image"], required: true },
    text: { type: String, required: false },
    image: { type: String, required: false },
    mimeType: { type: String, required: false },
  },
  { _id: false },
);

const MessageSchema = new Schema<IMessage>(
  {
    id: { type: String, required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    parts: { type: [MessagePartSchema], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

// ──────────────────────────────────────────────
// Main schema
// ──────────────────────────────────────────────

const ConversationSchema = new Schema<IConversation>(
  {
    uid: {
      type: String,
      required: true,
      index: true,
    },
    title: { type: String, default: "New Conversation" },
    messages: { type: [MessageSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient lookups
ConversationSchema.index({ uid: 1, updatedAt: -1 });

export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema,
);
