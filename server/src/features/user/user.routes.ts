import { Router } from "express";
import { requireAuthWithUser } from "@/lib/middleware/auth.js";
import { getMe, completeOnboarding } from "@/features/user/user.controller.js";

const router = Router();

// All user routes require authentication
router.use(requireAuthWithUser);

router.get("/me", getMe);
router.post("/onboarding", completeOnboarding);

export default router;
