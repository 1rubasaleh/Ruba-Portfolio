const connectDB = require("../config/db");
const runQuery = require("../config/query");
const getAllRoles = async () => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Roles",
    'SELECT * FROM portfolio."Roles"',
  );

  return result.recordset;
};
const getRoleById = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Roles WHERE RoleId = @id",
    'SELECT * FROM portfolio."Roles" WHERE "RoleId" = $1',
    { id },
  );

  return result.recordset[0];
};
const createRole = async (roleName) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      INSERT INTO portfolio.Roles
      (RoleName)
      OUTPUT INSERTED.*
      VALUES (@roleName)
    `, `
      INSERT INTO portfolio."Roles" ("RoleName")
      VALUES ($1)
      RETURNING *
    `, { roleName });

  return result.recordset[0];
};
const updateRole = async (id, roleName) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      UPDATE portfolio.Roles
      SET RoleName = @roleName
      OUTPUT INSERTED.*
      WHERE RoleId = @id
    `, `
      UPDATE portfolio."Roles"
      SET "RoleName" = $2
      WHERE "RoleId" = $1
      RETURNING *
    `, { id, roleName });

  return result.recordset[0];
};
const deleteRole = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      DELETE FROM portfolio.Roles
      OUTPUT DELETED.*
      WHERE RoleId = @id
    `, `
      DELETE FROM portfolio."Roles"
      WHERE "RoleId" = $1
      RETURNING *
    `, { id });

  return result.recordset[0];
};
module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
