import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const prices = {
  STARTER: { MONTHLY: 5, YEARLY: 50 },
  STANDARD: { MONTHLY: 15, YEARLY: 150 },
  PRO: { MONTHLY: 25, YEARLY: 250 }
};

function generateRef() {
  return "PAY-" + Math.floor(Math.random() * 99999999);
}

// 1. checkout abonnement
export const checkoutSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { plan, method, billingCycle = "MONTHLY", autoRenew = false } = req.body;

    const vendor = await prisma.vendor.findFirst({
      where: { userId }
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendeur introuvable" });
    }

    const amount = prices[plan]?.[billingCycle];

    if (!amount) {
      return res.status(400).json({ message: "Plan invalide" });
    }

    const now = new Date();

    const expiresAt =
      billingCycle === "YEARLY"
        ? new Date(now.setFullYear(now.getFullYear() + 1))
        : new Date(now.setMonth(now.getMonth() + 1));

    const reference = generateRef();

    const subscription = await prisma.subscription.upsert({
      where: { vendorId: vendor.id },
      update: {
        plan,
        billingCycle,
        autoRenew,
        startedAt: new Date(),
        expiresAt,
        isActive: true
      },
      create: {
        vendorId: vendor.id,
        plan,
        billingCycle,
        autoRenew,
        startedAt: new Date(),
        expiresAt,
        isActive: true
      }
    });

    await prisma.paymentHistory.create({
      data: {
        vendorId: vendor.id,
        plan,
        billingCycle,
        amount,
        method,
        reference,
        status: "SUCCESS"
      }
    });

    res.json({
      message: "Paiement validé",
      reference,
      amount,
      subscription
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. sauvegarder méthode paiement
export const savePaymentMethod = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.userId;
    const { method, accountName, accountRef } = req.body;

    const saved = await prisma.paymentMethod.create({
      data: {
        userId,
        method,
        accountName,
        accountRef,
        isDefault: true
      }
    });

    res.json(saved);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. historique paiements
export const paymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const vendor = await prisma.vendor.findFirst({
      where: { userId }
    });

    const history = await prisma.paymentHistory.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: "desc" }
    });

    res.json(history);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renewNow = async (req, res) => {
  try {
    const userId = req.user.userId;

    const vendor = await prisma.vendor.findFirst({
      where: { userId }
    });

    const subscription = await prisma.subscription.findUnique({
      where: { vendorId: vendor.id }
    });

    if (!subscription || !subscription.isActive) {
      return res.status(400).json({
        message: "Aucun abonnement actif"
      });
    }

    if (!subscription.autoRenew) {
      return res.status(400).json({
        message: "Auto renew désactivé"
      });
    }

    // simulation fonds disponibles
    const fundsAvailable = true;

    if (!fundsAvailable) {
      return res.status(400).json({
        message: "Fonds insuffisants"
      });
    }

    const prices = {
      STARTER: 5,
      STANDARD: 15,
      PRO: 25
    };

    const amount = prices[subscription.plan];

    const newExpire = new Date(subscription.expiresAt);
    newExpire.setMonth(newExpire.getMonth() + 1);

    await prisma.subscription.update({
      where: { vendorId: vendor.id },
      data: {
        expiresAt: newExpire
      }
    });

    await prisma.paymentHistory.create({
      data: {
        vendorId: vendor.id,
        plan: subscription.plan,
        billingCycle: "MONTHLY",
        amount,
        method: "ORANGE",
        reference: "RENEW-" + Date.now(),
        status: "SUCCESS"
      }
    });

    res.json({
      message: "Renouvellement réussi",
      newExpire
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


export const boostProductPayment = async (req, res) => {
  try {
    const { productId, days, method, phone } = req.body;

    const userId = req.user.userId;

    if (!productId || !days) {
      return res.status(400).json({
        message: "Produit et durée requis"
      });
    }

    let amount = 0;

    if (days === 3) amount = 5;
    if (days === 7) amount = 15;
    if (days === 30) amount = 40;

    if (amount === 0) {
      return res.status(400).json({
        message: "Durée invalide"
      });
    }

    const payment = await prisma.boostPayment.create({
      data: {
        userId,
        productId,
        days,
        amount,
        method: method || "MOBILE_MONEY",
        phone: phone || "",
        status: "SUCCESS"
      }
    });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        isBoosted: true,
        boostUntil: endDate
      }
    });

    res.json({
      message: "Boost activé avec succès",
      payment
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
