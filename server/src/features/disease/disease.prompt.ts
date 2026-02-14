import { z } from "zod";
import { IUser } from "../user/user.model.js";

export const DiseaseAnalysisSchema = z.object({
  language: z.string().describe("Language used for all text fields."),
  crop: z
    .string()
    .describe("Crop name inferred from image or provided by user."),
  isHealthy: z
    .boolean()
    .describe("True if no visible disease or pest damage is detected."),
  diseaseName: z.string().describe("Most likely disease name or 'Unknown'."),
  diseaseType: z
    .enum([
      "fungal",
      "bacterial",
      "viral",
      "pest",
      "nutrient_deficiency",
      "abiotic_stress",
      "unknown",
    ])
    .describe("Type of the disease or issue."),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe("Confidence score from 0 to 100."),
  severity: z
    .enum(["low", "medium", "high", "unknown"])
    .describe("Severity level of the infection."),
  summary: z.string().describe("Short summary of the diagnosis and impact."),
  symptoms: z.array(z.string()).describe("Visible symptoms seen in the image."),
  causes: z
    .array(z.string())
    .describe("Likely causes or contributing factors."),
  spreadRisk: z
    .array(z.string())
    .describe("How it spreads and current risk factors."),
  immediateActions: z
    .array(z.string())
    .describe("Immediate actions to reduce damage."),
  organicTreatment: z
    .array(z.string())
    .describe("Organic or low-toxicity treatment options."),
  chemicalTreatment: z
    .array(z.string())
    .describe("Chemical treatment options (active ingredients)."),
  prevention: z.array(z.string()).describe("Preventive practices for future."),
  monitoring: z.array(z.string()).describe("What to monitor after treatment."),
  whenToSeekHelp: z
    .array(z.string())
    .describe("When to consult local agronomist/extension."),
  imageQuality: z
    .enum(["good", "ok", "poor"])
    .describe("Quality of the uploaded image."),
  imageNotes: z
    .string()
    .describe("Notes about image clarity or missing information."),
});

export type DiseaseAnalysis = z.infer<typeof DiseaseAnalysisSchema>;

export const buildDiseasePrompt = ({
  user,
  languageName,
  cropHint,
  notes,
}: {
  user: IUser;
  languageName: string;
  cropHint?: string;
  notes?: string;
}): string => {
  const location = [
    user.location?.villageOrTown,
    user.location?.district,
    user.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const crops = (user.crops || []).map((c) => c.cropName).join(", ");

  return `You are an expert agronomist and plant pathologist using the Gemini 1.5 Flash model.
Your task is to analyze the provided crop/leaf image and return a structured analysis.

**STRICT OUTPUT RULES:**
1.  **Language**: ALL text fields (summary, symptoms, treatments, etc.) MUST be in **${languageName}**.
2.  **Enums**: The fields 'diseaseType', 'severity', and 'imageQuality' MUST use the exact English enum values provided in the schema. Do NOT translate these specific values.
3.  **Confidence**: Provide a confidence score between 0 and 100.
4.  **No Plant/Unclear**: If the image is not a plant or is too blurry to diagnose, set 'imageQuality' to 'poor', 'diseaseName' to 'Unknown', and explain why in 'imageNotes'.
5.  **Healthy Plant**: If the plant looks healthy, set 'isHealthy' to true and 'diseaseName' to 'Healthy'.

**Context Information:**
- Farmer Location: ${location || "Unknown"}
- Farmer's Crops: ${crops || "Unknown"}
- User's Crop Hint: ${cropHint || "Not provided"}
- User's Notes: ${notes || "None"}

**Content Guidelines:**
- **Symptoms**: Be specific about what is visible (e.g., "yellow halos on leaves", "brown spots").
- **Treatments**:
    - **Organic**: Suggest home remedies, biological controls, or cultural practices.
    - **Chemical**: Suggest active ingredients (e.g., "Mancozeb", "Imidacloprid") rather than specific brand names if possible. Add a disclaimer to check local regulations.
- **Prevention**: Focus on long-term sustainability.
- **Tone**: Helpful, encouraging, and expert-level but easy to understand for a farmer.

Analyze the image now.`;
};
