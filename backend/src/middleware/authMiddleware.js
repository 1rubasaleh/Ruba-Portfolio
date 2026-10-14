const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");
const runQuery = require("../config/query");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenMatch = /^Bearer\s+(.+)$/i.exec(authHeader || "");

  if (!tokenMatch) {
    return res.status(401).json({
      message: "A valid bearer access token is required",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(tokenMatch[1], process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  if (!decoded || typeof decoded !== "object" || !decoded.userId) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  try {
    const pool = await connectDB();
    const result = await runQuery(pool, `
      SELECT u.UserId, u.Name, u.Email, u.RoleId, r.RoleName
      FROM portfolio.Users AS u
      INNER JOIN portfolio.Roles AS r ON r.RoleId = u.RoleId
      WHERE u.UserId = @userId
    `, `
      SELECT u."UserId", u."Name", u."Email", u."RoleId", r."RoleName"
      FROM portfolio."Users" AS u
      INNER JOIN portfolio."Roles" AS r ON r."RoleId" = u."RoleId"
      WHERE u."UserId" = $1
    `, { userId: decoded.userId });

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({
        message: "The account associated with this token no longer exists",
      });
    }

    req.user = {
      userId: user.UserId,
      name: user.Name,
      email: user.Email,
      roleId: user.RoleId,
      roleName: user.RoleName,
    };

    return next();
  } catch (error) {
    console.error("Unable to verify authenticated user:", error);
    return res.status(500).json({
      message: "Unable to verify account permissions",
    });
  }
};

module.exports = authMiddleware;
