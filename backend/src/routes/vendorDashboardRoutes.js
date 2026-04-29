import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { vendorDashboard } from "../controllers/vendorDashboardController.js";

const router = express.Router();

router.get("/", protect, vendorDashboard);

export default router;