import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  choosePlan,
  myPlan
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/choose-plan", protect, choosePlan);
router.get("/my-plan", protect, myPlan);

export default router;