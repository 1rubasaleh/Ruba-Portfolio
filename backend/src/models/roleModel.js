const connectDB = require("../config/db");
const getAllRoles = async () => {
  const pool = await connectDB();

  const result = await pool.request().query("SELECT * FROM portfolio.Roles");

  return result.recordset;
};
const getRoleById = async (id) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM portfolio.Roles WHERE RoleId = @id");

  return result.recordset[0];
};
const createRole = async (roleName) => {
  const pool = await connectDB();

  const result = await pool.request().input("roleName", roleName).query(`
      INSERT INTO portfolio.Roles
      (RoleName)
      OUTPUT INSERTED.*
      VALUES (@roleName)
    `);

  return result.recordset[0];
};
const updateRole = async (id, roleName) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .input("roleName", roleName).query(`
      UPDATE portfolio.Roles
      SET RoleName = @roleName
      OUTPUT INSERTED.*
      WHERE RoleId = @id
    `);

  return result.recordset[0];
};
const deleteRole = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.Roles
      OUTPUT DELETED.*
      WHERE RoleId = @id
    `);

  return result.recordset[0];
};
module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
