import { Router } from "express";
import { requireAuthWithUser } from "@/lib/middleware/auth.js";
import {
  analyzeDisease,
  getHistory,
} from "@/features/disease/disease.controller.js";

const router = Router();

router.use(requireAuthWithUser);

router.post("/analyze", analyzeDisease);
router.get("/history", getHistory);

export default router;
