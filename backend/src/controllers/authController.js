const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("../config/db");

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedName) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email",
      });
    }

    if (typeof password !== "string") {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain an uppercase letter",
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain a lowercase letter",
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain a number",
      });
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({
        message: "Password must contain a special character",
      });
    }

    const pool = await connectDB();
    const existingUser = await pool
      .request()
      .input("email", normalizedEmail).query(`
        SELECT UserId
        FROM portfolio.Users
        WHERE Email = @email
      `);

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const userRoleResult = await pool.request().input("roleName", "user")
      .query(`
        SELECT RoleId
        FROM portfolio.Roles
        WHERE LOWER(LTRIM(RTRIM(RoleName))) = @roleName
      `);

    if (userRoleResult.recordset.length !== 1) {
      console.error(
        "Registration requires exactly one 'user' role in portfolio.Roles.",
      );
      return res.status(500).json({
        message: "Registration is not configured. Please contact the site administrator.",
      });
    }

    const result = await pool
      .request()
      .input("name", normalizedName)
      .input("email", normalizedEmail)
      .input("passwordHash", passwordHash)
      .input("roleId", userRoleResult.recordset[0].RoleId).query(`
        INSERT INTO portfolio.Users
        (Name, Email, PasswordHash, RoleId)
        OUTPUT
          INSERTED.UserId,
          INSERTED.Name,
          INSERTED.Email,
          INSERTED.RoleId,
          INSERTED.CreatedAt
        VALUES
          (@name, @email, @passwordHash, @roleId)
      `);

    res.status(201).json({
      message: "User registered successfully",
      user: result.recordset[0],
    });
  } catch (error) {
    console.error(error);

    if (error.number === 2601 || error.number === 2627) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Registration could not be completed. Please try again.",
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || typeof password !== "string" || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const pool = await connectDB();

    const result = await pool
      .request()
      .input("email", normalizedEmail).query(`
        SELECT u.UserId, u.Name, u.Email, u.PasswordHash, u.RoleId, r.RoleName
        FROM portfolio.Users AS u
        INNER JOIN portfolio.Roles AS r ON r.RoleId = u.RoleId
        WHERE u.Email = @email
      `);

    // Check if user exists
    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.recordset[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.UserId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Login successful
    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.UserId,
        name: user.Name,
        email: user.Email,
        roleId: user.RoleId,
        roleName: user.RoleName,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error logging in",
    });
  }
};

const getCurrentUser = (req, res) => {
  res.json({ user: req.user });
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
