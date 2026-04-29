import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createProduct,
  myProducts,
  publicProducts,
  shopProducts,
  updateProduct,
  deleteProduct,
  boostProduct
} from "../controllers/productController.js";

const router = express.Router();

/*
=====================================
 PRODUITS VENDEUR PRIVÉS
=====================================
*/

// créer produit
router.post("/", protect, createProduct);

// voir mes produits
router.get("/my-products", protect, myProducts);

// booster produit 🚀
router.patch(
  "/boost/:id",
  protect,
  boostProduct
);

// modifier produit
router.patch(
  "/:id",
  protect,
  updateProduct
);

// supprimer produit
router.delete(
  "/:id",
  protect,
  deleteProduct
);

/*
=====================================
 PRODUITS PUBLICS
=====================================
*/

// homepage marketplace
router.get("/public", publicProducts);

// boutique vendeur
router.get(
  "/shop/:shopName",
  shopProducts
);

export default router;