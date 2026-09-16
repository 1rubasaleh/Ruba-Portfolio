const connectDB = require("../config/db");

// Get all favorites
const getAllFavorites = async () => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .query("SELECT * FROM portfolio.Favorites");

  return result.recordset;
};

// Get favorites for a specific user
const getFavoritesByUserId = async (userId) => {
  const pool = await connectDB();

  const result = await pool.request().input("userId", userId).query(`
      SELECT *
      FROM portfolio.Favorites
      WHERE UserId = @userId
    `);

  return result.recordset;
};

// Get users who favorited a specific project
const getUsersByProjectId = async (projectId) => {
  const pool = await connectDB();

  const result = await pool.request().input("projectId", projectId).query(`
      SELECT *
      FROM portfolio.Favorites
      WHERE ProjectId = @projectId
    `);

  return result.recordset;
};

// Add favorite
const createFavorite = async (userId, projectId) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("userId", userId)
    .input("projectId", projectId).query(`
      INSERT INTO portfolio.Favorites
      (UserId, ProjectId)
      OUTPUT INSERTED.*
      VALUES
      (@userId, @projectId)
    `);

  return result.recordset[0];
};

// Remove favorite
const deleteFavorite = async (userId, projectId) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("userId", userId)
    .input("projectId", projectId).query(`
      DELETE FROM portfolio.Favorites
      OUTPUT DELETED.*
      WHERE UserId = @userId
      AND ProjectId = @projectId
    `);

  return result.recordset[0];
};

module.exports = {
  getAllFavorites,
  getFavoritesByUserId,
  getUsersByProjectId,
  createFavorite,
  deleteFavorite,
};
