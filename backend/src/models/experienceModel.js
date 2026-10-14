const connectDB = require("../config/db");
const runQuery = require("../config/query");

// Get all experiences
const getAllExperiences = async () => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Experiences",
    'SELECT * FROM portfolio."Experiences"',
  );

  return result.recordset;
};

// Get experience by ID
const getExperienceById = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT *
      FROM portfolio.Experiences
      WHERE ExperienceId = @id
    `, `
      SELECT *
      FROM portfolio."Experiences"
      WHERE "ExperienceId" = $1
    `, { id });

  return result.recordset[0];
};

// Get experiences by profile ID
const getExperiencesByProfileId = async (profileId) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT *
      FROM portfolio.Experiences
      WHERE ProfileId = @profileId
    `, `
      SELECT *
      FROM portfolio."Experiences"
      WHERE "ProfileId" = $1
    `, { profileId });

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

  const result = await runQuery(
    pool,
    `
      INSERT INTO portfolio.Experiences
      (ProfileId, CompanyName, Position, StartDate, EndDate, Description)
      OUTPUT INSERTED.*
      VALUES
      (@profileId, @companyName, @position, @startDate, @endDate, @description)
    `,
    `
      INSERT INTO portfolio."Experiences"
      (
        "ProfileId",
        "CompanyName",
        "Position",
        "StartDate",
        "EndDate",
        "Description"
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    { profileId, companyName, position, startDate, endDate, description },
  );

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

  const result = await runQuery(
    pool,
    `
      UPDATE portfolio.Experiences
      SET
        ProfileId = @profileId,
        CompanyName = @companyName,
        Position = @position,
        StartDate = @startDate,
        EndDate = @endDate,
        Description = @description
      OUTPUT INSERTED.*
      WHERE ExperienceId = @id
    `,
    `
      UPDATE portfolio."Experiences"
      SET
        "ProfileId" = $2,
        "CompanyName" = $3,
        "Position" = $4,
        "StartDate" = $5,
        "EndDate" = $6,
        "Description" = $7
      WHERE "ExperienceId" = $1
      RETURNING *
    `,
    {
      id,
      profileId,
      companyName,
      position,
      startDate,
      endDate,
      description,
    },
  );

  return result.recordset[0];
};

// Delete experience
const deleteExperience = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      DELETE FROM portfolio.Experiences
      OUTPUT DELETED.*
      WHERE ExperienceId = @id
    `, `
      DELETE FROM portfolio."Experiences"
      WHERE "ExperienceId" = $1
      RETURNING *
    `, { id });

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
