const authorize = (allowedRoleId) => {
  return (req, res, next) => {
    const userRoleId = req.user.roleId;
    if (userRoleId !== allowedRoleId) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
};
module.exports = authorize;
