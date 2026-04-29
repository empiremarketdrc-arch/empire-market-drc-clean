import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

import {
  getMetrics,
  pendingVendors,
  approveVendor,
  suspendVendor,
  activateVendor,
  allVendors
} from "../controllers/adminController.js";

const router = express.Router();

/* Dashboard */
router.get(
  "/metrics",
  protect,
  isAdmin,
  getMetrics
);

/* Tous vendeurs */
router.get(
  "/vendors",
  protect,
  isAdmin,
  allVendors
);

/* En attente */
router.get(
  "/vendors/pending",
  protect,
  isAdmin,
  pendingVendors
);

/* Approuver */
router.patch(
  "/vendors/:id/approve",
  protect,
  isAdmin,
  approveVendor
);

/* Suspendre */
router.patch(
  "/vendors/:id/suspend",
  protect,
  isAdmin,
  suspendVendor
);

/* Réactiver */
router.patch(
  "/vendors/:id/activate",
  protect,
  isAdmin,
  activateVendor
);

export default router;