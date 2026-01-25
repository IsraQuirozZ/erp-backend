const requireRole = (allowedRoles) => {
  if (!Array.isArray(allowedRoles)) {
    allowedRoles = [allowedRoles];
  }

  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role)); // true | false

    if (!hasRole) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};

module.exports = requireRole;
