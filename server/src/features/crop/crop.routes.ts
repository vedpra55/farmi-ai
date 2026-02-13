import { Router } from "express";
import { requireAuthWithUser } from "@/lib/middleware/auth.js";
import {
  addCrop,
  updateCrop,
  deleteCrop,
} from "@/features/crop/crop.controller.js";

const router = Router();

router.use(requireAuthWithUser);

router.post("/", addCrop);
router.put("/:cropId", updateCrop);
router.delete("/:cropId", deleteCrop);

export default router;
