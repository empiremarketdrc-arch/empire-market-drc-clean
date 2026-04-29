import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  checkoutSubscription,
  savePaymentMethod,
  paymentHistory,
  boostProductPayment
} from "../controllers/paymentController.js";

import { renewNow } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/checkout", protect, checkoutSubscription);

router.post("/save-method", protect, savePaymentMethod);

router.post("/renew-now", protect, renewNow);

router.get("/history", protect, paymentHistory);

router.post("/boost", protect, boostProductPayment);

export default router;