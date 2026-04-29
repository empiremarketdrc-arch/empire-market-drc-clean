import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // 🔥 IMPORTANT : laisser passer OPTIONS
    if (req.method === "OPTIONS") {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token manquant"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Token invalide"
    });
  }
};