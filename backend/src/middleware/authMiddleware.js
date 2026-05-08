
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const protect = async (req, res, next) => {
  try {
    // 🔥 Laisser passer les requêtes OPTIONS (CORS)
    if (req.method === "OPTIONS") {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token manquant ou mal formaté"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET manquant");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Vérifier que l'utilisateur existe encore
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({
        message: "Utilisateur invalide"
      });
    }

    // 🔥 On attache un user propre (pas juste le token)
    req.user = {
      userId: user.id,
      role: user.role
    };

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      message: "Accès non autorisé"
    });
  }
};