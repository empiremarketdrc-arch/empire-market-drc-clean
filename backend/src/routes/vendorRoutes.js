import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  applyVendor,
  myVendorProfile,
  updateVendorProfile
} from "../controllers/vendorController.js";

const router = express.Router();

router.post("/apply", protect, applyVendor);

router.get("/profile", protect, myVendorProfile);

router.patch("/profile", protect, updateVendorProfile);

export default router;