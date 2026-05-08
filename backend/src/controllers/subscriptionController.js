import prisma from "../lib/prisma.js";

export const choosePlan = async (req, res) => {
  try {
    const { plan } = req.body;

    const vendor = await prisma.vendor.findFirst({
      where: {
        userId: req.user.userId,
        status: "APPROVED"
      }
    });

    if (!vendor) {
      return res.status(403).json({
        message: "Vendeur approuvé requis"
      });
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const subscription = await prisma.subscription.upsert({
      where: {
        vendorId: vendor.id
      },
      update: {
        plan,
        startedAt: new Date(),
        expiresAt,
        isActive: true
      },
      create: {
        vendorId: vendor.id,
        plan,
        startedAt: new Date(),
        expiresAt,
        isActive: true
      }
    });

    res.json({
      message: "Abonnement activé",
      subscription
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const myPlan = async (req, res) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: {
        userId: req.user.userId
      }
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendeur introuvable"
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        vendorId: vendor.id
      }
    });

    res.json(subscription);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};