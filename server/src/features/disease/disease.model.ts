import mongoose, { Schema } from "mongoose";

export interface IDiseaseScan {
  uid: string;
  image: {
    data: string;
    mimeType: string;
  };
  analysis: Record<string, unknown>;
  language: string;
  cropHint?: string;
  notes?: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema(
  {
    data: { type: String, required: true },
    mimeType: { type: String, required: true },
  },
  { _id: false },
);

const DiseaseScanSchema = new Schema<IDiseaseScan>(
  {
    uid: { type: String, required: true, index: true },
    image: { type: ImageSchema, required: true },
    analysis: { type: Schema.Types.Mixed, required: true },
    language: { type: String, required: true },
    cropHint: { type: String, trim: true },
    notes: { type: String, trim: true },
    model: { type: String, required: true },
  },
  { timestamps: true },
);

DiseaseScanSchema.index({ uid: 1, createdAt: -1 });

export const DiseaseScan = mongoose.model<IDiseaseScan>(
  "DiseaseScan",
  DiseaseScanSchema,
);
