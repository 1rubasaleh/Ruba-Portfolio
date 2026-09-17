const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("../config/db");

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email",
      });
    }

    // Check if email already exists
    const pool = await connectDB();

    const existingUser = await pool.request().input("email", email).query(`
        SELECT *
        FROM portfolio.Users
        WHERE Email = @email
      `);

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Password validation
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

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool
      .request()
      .input("name", name)
      .input("email", email)
      .input("passwordHash", passwordHash)
      .input("roleId", 2).query(`
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

    res.status(500).json({
      message: "Error registering user",
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await connectDB();

    const result = await pool.request().input("email", email).query(`
        SELECT *
        FROM portfolio.Users
        WHERE Email = @email
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
        roleId: user.RoleId,
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
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error logging in",
    });
  }
};

module.exports = {
  register,
  login,
};
