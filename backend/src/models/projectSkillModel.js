const connectDB = require("../config/db");

// Get all project skills
const getAllProjectSkills = async () => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .query("SELECT * FROM portfolio.ProjectSkills");

  return result.recordset;
};

// Get skills for a specific project
const getSkillsByProjectId = async (projectId) => {
  const pool = await connectDB();

  const result = await pool.request().input("projectId", projectId).query(`
      SELECT *
      FROM portfolio.ProjectSkills
      WHERE ProjectId = @projectId
    `);

  return result.recordset;
};

// Get projects for a specific skill
const getProjectsBySkillId = async (skillId) => {
  const pool = await connectDB();

  const result = await pool.request().input("skillId", skillId).query(`
      SELECT *
      FROM portfolio.ProjectSkills
      WHERE SkillId = @skillId
    `);

  return result.recordset;
};

// Add skill to project
const createProjectSkill = async (projectId, skillId) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("projectId", projectId)
    .input("skillId", skillId).query(`
      INSERT INTO portfolio.ProjectSkills
      (ProjectId, SkillId)
      OUTPUT INSERTED.*
      VALUES
      (@projectId, @skillId)
    `);

  return result.recordset[0];
};

// Delete skill from project
const deleteProjectSkill = async (projectId, skillId) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("projectId", projectId)
    .input("skillId", skillId).query(`
      DELETE FROM portfolio.ProjectSkills
      OUTPUT DELETED.*
      WHERE ProjectId = @projectId
      AND SkillId = @skillId
    `);

  return result.recordset[0];
};

module.exports = {
  getAllProjectSkills,
  getSkillsByProjectId,
  getProjectsBySkillId,
  createProjectSkill,
  deleteProjectSkill,
};
