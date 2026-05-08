import prisma from "./lib/prisma.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import vendorDashboardRoutes from "./routes/vendorDashboardRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


dotenv.config();

const app = express();

/* ======================
   MIDDLEWARES GLOBAUX
====================== */

// sécurité (doit être tôt)
app.use(helmet());

// CORS (CONFIGURÉ proprement)
app.use(cors({
  origin: [
  "http://localhost:5173",
  "https://empire-frontend-1q1m.onrender.com"
],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// IMPORTANT pour preflight


// body parser
app.use(express.json());

// rate limiter (avant routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Trop de requêtes, réessaie plus tard."
});

app.use(limiter);

/* ======================
   ROUTES
====================== */

app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/vendor/dashboard", vendorDashboardRoutes);
app.use("/api/payment", paymentRoutes);


/* ======================
   ERROR HANDLER
====================== */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Erreur serveur"
  });
});
 

/* ======================
   SERVER
====================== */


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});