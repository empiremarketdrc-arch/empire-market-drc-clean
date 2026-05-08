import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont requis"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Mot de passe trop court"
      });
    }

    // 🔒 Vérification doublon
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email ou téléphone déjà utilisé"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword
      }
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET manquant");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Inscription réussie",
      token,
      role: user.role
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Erreur serveur"
    });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Champs manquants"
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "Utilisateur introuvable"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Mot de passe incorrect"
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Connexion réussie",
      token,
      role: user.role
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Erreur serveur"
    });
  }
};

/* =========================
   ME
========================= */
export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { vendor: true }
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    let dashboardType = "CLIENT";

    if (user.role === "ADMIN") {
      dashboardType = "ADMIN";
    } else if (user.vendor) {
      dashboardType = "VENDOR";
    }

    return res.status(200).json({
      dashboardType,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role
      },
      vendor: user.vendor
    });

  } catch (error) {
    console.error("ME ERROR:", error);

    return res.status(500).json({
      message: "Erreur serveur"
    });
  }
}