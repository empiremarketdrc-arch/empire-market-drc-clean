import prisma from "../lib/prisma.js";

/* =========================
   HELPER (interne uniquement)
========================= */
const findVendorByUserId = async (userId) => {
  return prisma.vendor.findFirst({
    where: { userId }
  });
};

/* =========================
   APPLY VENDEUR
========================= */
export const applyVendor = async (req, res) => {
  try {
    const userId = req.user.userId;

    const existingVendor = await findVendorByUserId(userId);

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
        status: "PENDING",   // 🔒 contrôlé serveur
        badge: "SILVER"      // 🔒 contrôlé serveur
      }
    });

    return res.status(201).json({
      message: "Demande vendeur envoyée",
      vendor
    });

  } catch (error) {
    console.error("APPLY VENDOR ERROR:", error);

    return res.status(500).json({
      message: "Erreur serveur"
    });
  }
};

/* =========================
   PROFIL VENDEUR
========================= */
export const myVendorProfile = async (req, res) => {
  try {
    const vendor = await findVendorByUserId(req.user.userId);

    if (!vendor) {
      return res.status(404).json({
        message: "Profil vendeur introuvable"
      });
    }

    return res.status(200).json(vendor);

  } catch (error) {
    console.error("GET VENDOR PROFILE ERROR:", error);

    return res.status(500).json({
      message: "Erreur serveur"
    });
  }
};

/* =========================
   UPDATE PROFIL
========================= */
export const updateVendorProfile = async (req, res) => {
  try {
    const vendor = await findVendorByUserId(req.user.userId);

    if (!vendor) {
      return res.status(404).json({
        message: "Profil vendeur introuvable"
      });
    }

    // 🔒 whitelist des champs autorisés
    const {
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

    const updated = await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        shopName,
        whatsapp,
        phoneBusiness,
        description,
        paymentMethod,
        paymentNumber,
        bankName,
        bankHolder,
        bankAccount
      }
    });

    return res.status(200).json({
      message: "Profil mis à jour",
      vendor: updated
    });

  } catch (error) {
    console.error("UPDATE VENDOR ERROR:", error);

    return res.status(500).json({
      message: "Erreur serveur"
    });
  }
};