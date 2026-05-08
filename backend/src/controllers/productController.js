import prisma from "../lib/prisma.js";
/* ===================================
   HELPERS
=================================== */

async function getApprovedVendor(userId) {
  return await prisma.vendor.findFirst({
    where: {
      userId,
      status: "APPROVED"
    }
  });
}

function getPlanLimit(plan) {
  if (plan === "STARTER") return 5;
  if (plan === "STANDARD") return 20;
  if (plan === "PRO") return Infinity;

  return 0;
}

/* ===================================
   CREATE PRODUCT
=================================== */

export const createProduct = async (req, res) => {
  try {
    const vendor = await getApprovedVendor(
      req.user.userId
    );

    if (!vendor) {
      return res.status(403).json({
        message: "Vendeur approuvé requis"
      });
    }

    const subscription =
      await prisma.subscription.findUnique({
        where: {
          vendorId: vendor.id
        }
      });

    if (
      !subscription ||
      !subscription.isActive
    ) {
      return res.status(403).json({
        message: "Abonnement requis"
      });
    }

    const totalProducts =
      await prisma.product.count({
        where: {
          vendorId: vendor.id
        }
      });

    const limit = getPlanLimit(
      subscription.plan
    );

    if (totalProducts >= limit) {
      return res.status(403).json({
        message:
          "Limite du plan atteinte"
      });
    }

    const {
      name,
      description,
      price,
      image,
      stock
    } = req.body;

    const product =
      await prisma.product.create({
        data: {
          vendorId: vendor.id,
          name,
          description,
          price: Number(price),
          image,
          stock: Number(stock || 0)
        }
      });

    res.json({
      message: "Produit créé",
      product
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* ===================================
   MY PRODUCTS
=================================== */

export const myProducts = async (
  req,
  res
) => {
  try {
    const vendor =
      await getApprovedVendor(
        req.user.userId
      );

    if (!vendor) {
      return res.status(403).json({
        message:
          "Accès vendeur requis"
      });
    }

    const products =
      await prisma.product.findMany({
        where: {
          vendorId: vendor.id
        },
        orderBy: {
          createdAt: "desc"
        }
      });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* ===================================
   PUBLIC PRODUCTS
   BOOSTED FIRST
=================================== */

export const publicProducts = async (req, res) => {
  try {
    const now = new Date();

    const products = await prisma.product.findMany({
      where: {
        isActive: true
      },
      include: {
        vendor: true
      },
      orderBy: [
        {
          isBoosted: "desc"
        },
        {
          createdAt: "desc"
        }
      ]
    });

    const cleaned = products.map((item) => {
      const expired =
        item.boostUntil &&
        new Date(item.boostUntil) < now;

      if (expired) {
        return {
          ...item,
          isBoosted: false
        };
      }

      return item;
    });

    res.json(cleaned);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* ===================================
   UPDATE PRODUCT
=================================== */

export const updateProduct = async (
  req,
  res
) => {
  try {
    const vendor =
      await getApprovedVendor(
        req.user.userId
      );

    if (!vendor) {
      return res.status(403).json({
        message:
          "Accès vendeur requis"
      });
    }

    const { id } = req.params;

    const product =
      await prisma.product.updateMany({
        where: {
          id,
          vendorId: vendor.id
        },
        data: req.body
      });

    res.json({
      message: "Produit modifié",
      product
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* ===================================
   DELETE PRODUCT
=================================== */

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const vendor =
      await getApprovedVendor(
        req.user.userId
      );

    if (!vendor) {
      return res.status(403).json({
        message:
          "Accès vendeur requis"
      });
    }

    const { id } = req.params;

    await prisma.product.deleteMany({
      where: {
        id,
        vendorId: vendor.id
      }
    });

    res.json({
      message:
        "Produit supprimé"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* ===================================
   BOOST PRODUCT
=================================== */

export const boostProduct = async (req, res) => {
  try {
    const vendor = await getApprovedVendor(
      req.user.userId
    );

    if (!vendor) {
      return res.status(403).json({
        message: "Accès vendeur requis"
      });
    }

    const { id } = req.params;
    const { days, reference } = req.body;

    let duration = 3;

    if (days === 7) duration = 7;
    if (days === 30) duration = 30;

    const amount =
  days === 3
    ? 5
    : days === 7
    ? 10
    : 25;

    const boostUntil = new Date();

    boostUntil.setDate(
      boostUntil.getDate() + duration
    );

    await prisma.payment.create({
  data: {
    vendorId: vendor.id,
    productId: id,
    amount,
    reference,
    status: "approved",
    method: "Mobile Money"
  }
});

    const result =
      await prisma.product.updateMany({
        where: {
          id,
          vendorId: vendor.id
        },
        data: {
          isBoosted: true,
          boostUntil
        }
      });

    res.json({
      message: `Produit boosté ${duration} jours`,
      result
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* ===================================
   SHOP PRODUCTS
=================================== */

export const shopProducts = async (
  req,
  res
) => {
  try {
    const { shopName } =
      req.params;

    const vendor =
      await prisma.vendor.findFirst({
        where: {
          shopName,
          status:
            "APPROVED",
          isVisible: true,
          isSuspended: false
        },
        include: {
          user: true,
          products: {
            where: {
              isActive: true
            },
            orderBy: [
              {
                isBoosted:
                  "desc"
              },
              {
                createdAt:
                  "desc"
              }
            ]
          }
        }
      });

    if (!vendor) {
      return res.status(404).json({
        message:
          "Boutique introuvable"
      });
    }

    res.json(vendor);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};