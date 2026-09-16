const connectDB = require("../config/db");

// Get all profiles
const getAllProfiles = async () => {
  const pool = await connectDB();

  const result = await pool.request().query("SELECT * FROM portfolio.Profiles");

  return result.recordset;
};

// Get profile by ID
const getProfileById = async (id) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM portfolio.Profiles WHERE ProfileId = @id");

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

  const result = await pool
    .request()
    .input("userId", userId)
    .input("fullName", fullName)
    .input("title", title)
    .input("bio", bio)
    .input("imageUrl", imageUrl)
    .input("location", location)
    .input("cvUrl", cvUrl).query(`
      INSERT INTO portfolio.Profiles
      (UserId, FullName, Title, Bio, ImageUrl, Location, CvUrl)
      OUTPUT INSERTED.*
      VALUES
      (@userId, @fullName, @title, @bio, @imageUrl, @location, @cvUrl)
    `);

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

  const result = await pool
    .request()
    .input("id", id)
    .input("userId", userId)
    .input("fullName", fullName)
    .input("title", title)
    .input("bio", bio)
    .input("imageUrl", imageUrl)
    .input("location", location)
    .input("cvUrl", cvUrl).query(`
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
    `);

  return result.recordset[0];
};

// Delete profile
const deleteProfile = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.Profiles
      OUTPUT DELETED.*
      WHERE ProfileId = @id
    `);

  return result.recordset[0];
};

module.exports = {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
};
