const connectDB = require("../config/db");
const runQuery = require("../config/query");

// Get all education records
const getAllEducation = async () => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Educations",
    'SELECT * FROM portfolio."Educations"',
  );

  return result.recordset;
};

// Get education by ID
const getEducationById = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT *
      FROM portfolio.Educations
      WHERE EducationId = @id
    `, `
      SELECT *
      FROM portfolio."Educations"
      WHERE "EducationId" = $1
    `, { id });

  return result.recordset[0];
};

// Get education by profile ID
const getEducationByProfileId = async (profileId) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT *
      FROM portfolio.Educations
      WHERE ProfileId = @profileId
    `, `
      SELECT *
      FROM portfolio."Educations"
      WHERE "ProfileId" = $1
    `, { profileId });

  return result.recordset;
};

// Create education
const createEducation = async (
  profileId,
  institution,
  degree,
  fieldOfStudy,
  startDate,
  endDate,
  description,
) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      INSERT INTO portfolio.Educations
      (
        ProfileId,
        Institution,
        Degree,
        FieldOfStudy,
        StartDate,
        EndDate,
        Description
      )
      OUTPUT INSERTED.*
      VALUES
      (
        @profileId,
        @institution,
        @degree,
        @fieldOfStudy,
        @startDate,
        @endDate,
        @description
      )
    `,
    `
      INSERT INTO portfolio."Educations"
      (
        "ProfileId",
        "Institution",
        "Degree",
        "FieldOfStudy",
        "StartDate",
        "EndDate",
        "Description"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    {
      profileId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    },
  );

  return result.recordset[0];
};

// Update education
const updateEducation = async (
  id,
  profileId,
  institution,
  degree,
  fieldOfStudy,
  startDate,
  endDate,
  description,
) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      UPDATE portfolio.Educations
      SET
        ProfileId = @profileId,
        Institution = @institution,
        Degree = @degree,
        FieldOfStudy = @fieldOfStudy,
        StartDate = @startDate,
        EndDate = @endDate,
        Description = @description
      OUTPUT INSERTED.*
      WHERE EducationId = @id
    `,
    `
      UPDATE portfolio."Educations"
      SET
        "ProfileId" = $2,
        "Institution" = $3,
        "Degree" = $4,
        "FieldOfStudy" = $5,
        "StartDate" = $6,
        "EndDate" = $7,
        "Description" = $8
      WHERE "EducationId" = $1
      RETURNING *
    `,
    {
      id,
      profileId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    },
  );

  return result.recordset[0];
};

// Delete education
const deleteEducation = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      DELETE FROM portfolio.Educations
      OUTPUT DELETED.*
      WHERE EducationId = @id
    `, `
      DELETE FROM portfolio."Educations"
      WHERE "EducationId" = $1
      RETURNING *
    `, { id });

  return result.recordset[0];
};

module.exports = {
  getAllEducation,
  getEducationById,
  getEducationByProfileId,
  createEducation,
  updateEducation,
  deleteEducation,
};
