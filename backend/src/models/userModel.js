const connectDB = require("../config/db");

// Get all users
const getAllUsers = async () => {
  const pool = await connectDB();

  const result = await pool.request().query("SELECT * FROM portfolio.Users");

  return result.recordset;
};

// Get user by ID
const getUserById = async (id) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM portfolio.Users WHERE UserId = @id");

  return result.recordset[0];
};

// Create user
const createUser = async (name, email, passwordHash, roleId) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("name", name)
    .input("email", email)
    .input("passwordHash", passwordHash)
    .input("roleId", roleId).query(`
      INSERT INTO portfolio.Users
      (Name, Email, PasswordHash, RoleId)
      OUTPUT INSERTED.*
      VALUES
      (@name, @email, @passwordHash, @roleId)
    `);

  return result.recordset[0];
};

// Update user
const updateUser = async (id, name, email, passwordHash, roleId) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .input("name", name)
    .input("email", email)
    .input("passwordHash", passwordHash)
    .input("roleId", roleId).query(`
      UPDATE portfolio.Users
      SET
        Name = @name,
        Email = @email,
        PasswordHash = @passwordHash,
        RoleId = @roleId
      OUTPUT INSERTED.*
      WHERE UserId = @id
    `);

  return result.recordset[0];
};

// Delete user
const deleteUser = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.Users
      OUTPUT DELETED.*
      WHERE UserId = @id
    `);

  return result.recordset[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
