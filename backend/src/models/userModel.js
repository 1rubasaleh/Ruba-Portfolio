const connectDB = require("../config/db");
const runQuery = require("../config/query");

// Get all users
const getAllUsers = async () => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
    SELECT UserId, Name, Email, RoleId, CreatedAt
    FROM portfolio.Users
  `, `
    SELECT "UserId", "Name", "Email", "RoleId", "CreatedAt"
    FROM portfolio."Users"
  `);

  return result.recordset;
};

// Get user by ID
const getUserById = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT UserId, Name, Email, RoleId, CreatedAt
      FROM portfolio.Users
      WHERE UserId = @id
    `, `
      SELECT "UserId", "Name", "Email", "RoleId", "CreatedAt"
      FROM portfolio."Users"
      WHERE "UserId" = $1
    `, { id });

  return result.recordset[0];
};

// Create user
const createUser = async (name, email, passwordHash, roleId) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
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
    `,
    `
      INSERT INTO portfolio."Users"
      ("Name", "Email", "PasswordHash", "RoleId")
      VALUES ($1, $2, $3, $4)
      RETURNING "UserId", "Name", "Email", "RoleId", "CreatedAt"
    `,
    { name, email, passwordHash, roleId },
  );

  return result.recordset[0];
};

// Update user
const updateUser = async (id, name, email, passwordHash, roleId) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
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
    `,
    `
      UPDATE portfolio."Users"
      SET
        "Name" = $2,
        "Email" = $3,
        "PasswordHash" = $4,
        "RoleId" = $5
      WHERE "UserId" = $1
      RETURNING "UserId", "Name", "Email", "RoleId", "CreatedAt"
    `,
    { id, name, email, passwordHash, roleId },
  );

  return result.recordset[0];
};

// Delete user
const deleteUser = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      DELETE FROM portfolio.Users
      OUTPUT
        DELETED.UserId,
        DELETED.Name,
        DELETED.Email,
        DELETED.RoleId,
        DELETED.CreatedAt
      WHERE UserId = @id
    `, `
      DELETE FROM portfolio."Users"
      WHERE "UserId" = $1
      RETURNING "UserId", "Name", "Email", "RoleId", "CreatedAt"
    `, { id });

  return result.recordset[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
