export const authorize = (...roles) => {
  return (req, res, next) => {

    // 🔒 vérifier si protect a bien injecté req.user
    if (!req.user) {
      return res.status(401).json({
        message: "Non authentifié"
      });
    }

    // 🔒 vérifier si le rôle est autorisé
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Accès refusé"
      });
    }

    next();
  };
};