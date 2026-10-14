const connectDB = require("../config/db");
const runQuery = require("../config/query");

// Get all profiles
const getAllProfiles = async () => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Profiles",
    'SELECT * FROM portfolio."Profiles"',
  );

  return result.recordset;
};

// Get profile by ID
const getProfileById = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Profiles WHERE ProfileId = @id",
    'SELECT * FROM portfolio."Profiles" WHERE "ProfileId" = $1',
    { id },
  );

  return result.recordset[0];
};

// Create profile
const createProfile = async (
  userId,
  fullName,
  title,
  bio,
  imageUrl,
  location,
  cvUrl,
) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      INSERT INTO portfolio.Profiles
      (UserId, FullName, Title, Bio, ImageUrl, Location, CvUrl)
      OUTPUT INSERTED.*
      VALUES
      (@userId, @fullName, @title, @bio, @imageUrl, @location, @cvUrl)
    `,
    `
      INSERT INTO portfolio."Profiles"
      ("UserId", "FullName", "Title", "Bio", "ImageUrl", "Location", "CvUrl")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    { userId, fullName, title, bio, imageUrl, location, cvUrl },
  );

  return result.recordset[0];
};

// Update profile
const updateProfile = async (
  id,
  userId,
  fullName,
  title,
  bio,
  imageUrl,
  location,
  cvUrl,
) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      UPDATE portfolio.Profiles
      SET
        UserId = @userId,
        FullName = @fullName,
        Title = @title,
        Bio = @bio,
        ImageUrl = @imageUrl,
        Location = @location,
        CvUrl = @cvUrl
      OUTPUT INSERTED.*
      WHERE ProfileId = @id
    `,
    `
      UPDATE portfolio."Profiles"
      SET
        "UserId" = $2,
        "FullName" = $3,
        "Title" = $4,
        "Bio" = $5,
        "ImageUrl" = $6,
        "Location" = $7,
        "CvUrl" = $8
      WHERE "ProfileId" = $1
      RETURNING *
    `,
    { id, userId, fullName, title, bio, imageUrl, location, cvUrl },
  );

  return result.recordset[0];
};

// Delete profile
const deleteProfile = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      DELETE FROM portfolio.Profiles
      OUTPUT DELETED.*
      WHERE ProfileId = @id
    `, `
      DELETE FROM portfolio."Profiles"
      WHERE "ProfileId" = $1
      RETURNING *
    `, { id });

  return result.recordset[0];
};

module.exports = {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
};
