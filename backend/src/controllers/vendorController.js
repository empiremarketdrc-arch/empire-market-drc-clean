import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getVendor(userId) {
  return await prisma.vendor.findFirst({
    where: { userId }
  });
}

/* =========================
   APPLY VENDEUR
========================= */
export const applyVendor = async (req, res) => {
  try {
    const userId = req.user.userId;

    const existingVendor = await prisma.vendor.findFirst({
      where: { userId }
    });

    if (existingVendor) {
      return res.status(400).json({
        message: "Vous avez déjà une demande vendeur"
      });
    }

    const {
      type,
      shopName,
      whatsapp,
      phoneBusiness,
      description,
      paymentMethod,
      paymentNumber,
      bankName,
      bankHolder,
      bankAccount
    } = req.body;

    const cleanShopName = shopName?.trim();

    if (!cleanShopName || !type || !whatsapp) {
      return res.status(400).json({
        message: "Champs obligatoires manquants"
      });
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId,
        type,
        shopName: cleanShopName,
        whatsapp,
        phoneBusiness,
        description,
        paymentMethod,
        paymentNumber,
        bankName,
        bankHolder,
        bankAccount,
        status: "PENDING",
        badge: "SILVER"
      }
    });

    res.status(201).json({
      message: "Demande vendeur envoyée",
      vendor
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* =========================
   PROFIL VENDEUR
========================= */
export const myVendorProfile = async (req, res) => {
  try {
    const vendor = await getVendor(req.user.userId);

    if (!vendor) {
      return res.status(404).json({
        message: "Profil vendeur introuvable"
      });
    }

    res.json(vendor);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

/* =========================
   UPDATE PROFIL
========================= */
export const updateVendorProfile = async (req, res) => {
  try {
    const vendor = await getVendor(req.user.userId);

    if (!vendor) {
      return res.status(404).json({
        message: "Profil vendeur introuvable"
      });
    }

    const updated = await prisma.vendor.update({
      where: {
        id: vendor.id
      },
      data: req.body
    });

    res.json({
      message: "Profil mis à jour",
      vendor: updated
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};