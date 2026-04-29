export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Accès refusé admin uniquement"
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};