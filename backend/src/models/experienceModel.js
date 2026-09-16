const connectDB = require("../config/db");

// Get all experiences
const getAllExperiences = async () => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .query("SELECT * FROM portfolio.Experience");

  return result.recordset;
};

// Get experience by ID
const getExperienceById = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      SELECT *
      FROM portfolio.Experience
      WHERE ExperienceId = @id
    `);

  return result.recordset[0];
};

// Get experiences by profile ID
const getExperiencesByProfileId = async (profileId) => {
  const pool = await connectDB();

  const result = await pool.request().input("profileId", profileId).query(`
      SELECT *
      FROM portfolio.Experience
      WHERE ProfileId = @profileId
    `);

  return result.recordset;
};

// Create experience
const createExperience = async (
  profileId,
  companyName,
  position,
  startDate,
  endDate,
  description,
) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("profileId", profileId)
    .input("companyName", companyName)
    .input("position", position)
    .input("startDate", startDate)
    .input("endDate", endDate)
    .input("description", description).query(`
      INSERT INTO portfolio.Experience
      (ProfileId, CompanyName, Position, StartDate, EndDate, Description)
      OUTPUT INSERTED.*
      VALUES
      (@profileId, @companyName, @position, @startDate, @endDate, @description)
    `);

  return result.recordset[0];
};

// Update experience
const updateExperience = async (
  id,
  profileId,
  companyName,
  position,
  startDate,
  endDate,
  description,
) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .input("profileId", profileId)
    .input("companyName", companyName)
    .input("position", position)
    .input("startDate", startDate)
    .input("endDate", endDate)
    .input("description", description).query(`
      UPDATE portfolio.Experience
      SET
        ProfileId = @profileId,
        CompanyName = @companyName,
        Position = @position,
        StartDate = @startDate,
        EndDate = @endDate,
        Description = @description
      OUTPUT INSERTED.*
      WHERE ExperienceId = @id
    `);

  return result.recordset[0];
};

// Delete experience
const deleteExperience = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.Experience
      OUTPUT DELETED.*
      WHERE ExperienceId = @id
    `);

  return result.recordset[0];
};

module.exports = {
  getAllExperiences,
  getExperienceById,
  getExperiencesByProfileId,
  createExperience,
  updateExperience,
  deleteExperience,
};
