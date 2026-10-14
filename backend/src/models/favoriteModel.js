const connectDB = require("../config/db");
const runQuery = require("../config/query");

// Get all favorites
const getAllFavorites = async () => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Favorites",
    'SELECT * FROM portfolio."Favorites"',
  );

  return result.recordset;
};

// Get favorites for a specific user
const getFavoritesByUserId = async (userId) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT *
      FROM portfolio.Favorites
      WHERE UserId = @userId
    `, `
      SELECT *
      FROM portfolio."Favorites"
      WHERE "UserId" = $1
    `, { userId });

  return result.recordset;
};

// Get users who favorited a specific project
const getUsersByProjectId = async (projectId) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT *
      FROM portfolio.Favorites
      WHERE ProjectId = @projectId
    `, `
      SELECT *
      FROM portfolio."Favorites"
      WHERE "ProjectId" = $1
    `, { projectId });

  return result.recordset;
};

// Add favorite
const createFavorite = async (userId, projectId) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      INSERT INTO portfolio.Favorites
      (UserId, ProjectId)
      OUTPUT INSERTED.*
      VALUES
      (@userId, @projectId)
    `,
    `
      INSERT INTO portfolio."Favorites" ("UserId", "ProjectId")
      VALUES ($1, $2)
      RETURNING *
    `,
    { userId, projectId },
  );

  return result.recordset[0];
};

// Remove favorite
const deleteFavorite = async (userId, projectId) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      DELETE FROM portfolio.Favorites
      OUTPUT DELETED.*
      WHERE UserId = @userId
      AND ProjectId = @projectId
    `,
    `
      DELETE FROM portfolio."Favorites"
      WHERE "UserId" = $1
      AND "ProjectId" = $2
      RETURNING *
    `,
    { userId, projectId },
  );

  return result.recordset[0];
};

module.exports = {
  getAllFavorites,
  getFavoritesByUserId,
  getUsersByProjectId,
  createFavorite,
  deleteFavorite,
};
