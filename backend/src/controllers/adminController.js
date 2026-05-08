import prisma from "../lib/prisma.js";

/* =========================
   METRICS ADMIN
========================= */
export const getMetrics = async (req, res) => {
  try {
    const totalVendors = await prisma.vendor.count();

    const proActive = await prisma.subscription.count({
      where: {
        plan: "PRO",
        isActive: true
      }
    });

    const payments = await prisma.paymentHistory.findMany();

    const revenueTotal = payments.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const now = new Date();

    const revenueMonth = payments
      .filter(p => {
        const d = new Date(p.createdAt);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, item) => sum + item.amount, 0);

    const todayRevenue = payments
      .filter(p => {
        const d = new Date(p.createdAt);
        return d.toDateString() === now.toDateString();
      })
      .reduce((sum, item) => sum + item.amount, 0);

    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);

    const expiringSoon = await prisma.subscription.count({
      where: {
        expiresAt: {
          lte: next7Days,
          gte: now
        },
        isActive: true
      }
    });

    res.json({
      totalVendors,
      proActive,
      revenueTotal,
      revenueMonth,
      todayRevenue,
      expiringSoon
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   VENDEURS EN ATTENTE
========================= */
export const pendingVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        status: "PENDING"
      },
      include: {
        user: true
      }
    });

    res.json(vendors);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   APPROUVER VENDEUR
========================= */
export const approveVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        status: "APPROVED"
      }
    });

    res.json({
      message: "Vendeur approuvé",
      vendor
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   SUSPENDRE VENDEUR
========================= */
export const suspendVendor = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.vendor.update({
      where: { id },
      data: {
        isSuspended: true,
        isVisible: false
      }
    });

    res.json({
      message: "Vendeur suspendu"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   REACTIVER VENDEUR
========================= */
export const activateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.vendor.update({
      where: { id },
      data: {
        isSuspended: false,
        isVisible: true
      }
    });

    res.json({
      message: "Vendeur réactivé"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   TOUS LES VENDEURS
========================= */
export const allVendors = async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        user: true,
        subscription: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(vendors);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};