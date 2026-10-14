const connectDB = require("../config/db");

// Get all users
const getAllUsers = async () => {
  const pool = await connectDB();

  const result = await pool.request().query(`
    SELECT UserId, Name, Email, RoleId, CreatedAt
    FROM portfolio.Users
  `);

  return result.recordset;
};

// Get user by ID
const getUserById = async (id) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .query(`
      SELECT UserId, Name, Email, RoleId, CreatedAt
      FROM portfolio.Users
      WHERE UserId = @id
    `);

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
      OUTPUT
        INSERTED.UserId,
        INSERTED.Name,
        INSERTED.Email,
        INSERTED.RoleId,
        INSERTED.CreatedAt
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
      OUTPUT
        INSERTED.UserId,
        INSERTED.Name,
        INSERTED.Email,
        INSERTED.RoleId,
        INSERTED.CreatedAt
      WHERE UserId = @id
    `);

  return result.recordset[0];
};

// Delete user
const deleteUser = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.Users
      OUTPUT
        DELETED.UserId,
        DELETED.Name,
        DELETED.Email,
        DELETED.RoleId,
        DELETED.CreatedAt
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
