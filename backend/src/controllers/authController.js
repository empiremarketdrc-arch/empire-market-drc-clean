import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword
      }
    });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Inscription réussie",
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

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

    res.json({
  message: "Connexion réussie",
  token,
  role: user.role
});

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        vendor: true
      }
    });

    let dashboardType = "CLIENT";

    if (user.role === "ADMIN") {
      dashboardType = "ADMIN";
    } else if (user.vendor) {
      dashboardType = "VENDOR";
    }

    res.json({
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
    res.status(500).json({
      error: error.message
    });
  }
};