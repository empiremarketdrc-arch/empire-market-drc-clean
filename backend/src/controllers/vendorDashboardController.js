import prisma from "../lib/prisma.js";

export const vendorDashboard = async (req, res) => {
  try {
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

    const subscription = await prisma.subscription.findUnique({
      where: {
        vendorId: vendor.id
      }
    });

    const totalProducts = await prisma.product.count({
      where: {
        vendorId: vendor.id
      }
    });

    let limit = 5;
    let plan = "STARTER";

    if (subscription) {
      plan = subscription.plan;

      if (plan === "STANDARD") limit = 20;
      if (plan === "PRO") limit = 999999;
    }

    const remainingSlots = limit - totalProducts;

    res.json({
      shopName: vendor.shopName,
      plan,
      productsUsed: totalProducts,
      productLimit: limit === 999999 ? "Unlimited" : limit,
      remainingSlots: limit === 999999 ? "Unlimited" : remainingSlots,
      isNearLimit: totalProducts >= limit - 2,
      upgradeSuggestion:
        plan === "PRO"
          ? "Plan maximum actif"
          : "Passe PRO pour illimité"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};