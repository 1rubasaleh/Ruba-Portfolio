const authorize = (allowedRoleName) => {
  return (req, res, next) => {
    const currentRole = String(req.user?.roleName || "").trim().toLowerCase();
    if (currentRole !== allowedRoleName.trim().toLowerCase()) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
};
module.exports = authorize;
