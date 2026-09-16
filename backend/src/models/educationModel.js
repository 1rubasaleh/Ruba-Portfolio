const connectDB = require("../config/db");

// Get all education records
const getAllEducation = async () => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .query("SELECT * FROM portfolio.Education");

  return result.recordset;
};

// Get education by ID
const getEducationById = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      SELECT *
      FROM portfolio.Education
      WHERE EducationId = @id
    `);

  return result.recordset[0];
};

// Get education by profile ID
const getEducationByProfileId = async (profileId) => {
  const pool = await connectDB();

  const result = await pool.request().input("profileId", profileId).query(`
      SELECT *
      FROM portfolio.Education
      WHERE ProfileId = @profileId
    `);

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

  const result = await pool
    .request()
    .input("profileId", profileId)
    .input("institution", institution)
    .input("degree", degree)
    .input("fieldOfStudy", fieldOfStudy)
    .input("startDate", startDate)
    .input("endDate", endDate)
    .input("description", description).query(`
      INSERT INTO portfolio.Education
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
    `);

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

  const result = await pool
    .request()
    .input("id", id)
    .input("profileId", profileId)
    .input("institution", institution)
    .input("degree", degree)
    .input("fieldOfStudy", fieldOfStudy)
    .input("startDate", startDate)
    .input("endDate", endDate)
    .input("description", description).query(`
      UPDATE portfolio.Education
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
    `);

  return result.recordset[0];
};

// Delete education
const deleteEducation = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.Education
      OUTPUT DELETED.*
      WHERE EducationId = @id
    `);

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
