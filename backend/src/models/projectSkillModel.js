const connectDB = require("../config/db");
const runQuery = require("../config/query");

// Get all project skills
const getAllProjectSkills = async () => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.ProjectSkills",
    'SELECT * FROM portfolio."ProjectSkills"',
  );

  return result.recordset;
};

// Get skills for a specific project
const getSkillsByProjectId = async (projectId) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT *
      FROM portfolio.ProjectSkills
      WHERE ProjectId = @projectId
    `, `
      SELECT *
      FROM portfolio."ProjectSkills"
      WHERE "ProjectId" = $1
    `, { projectId });

  return result.recordset;
};

// Get projects for a specific skill
const getProjectsBySkillId = async (skillId) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT *
      FROM portfolio.ProjectSkills
      WHERE SkillId = @skillId
    `, `
      SELECT *
      FROM portfolio."ProjectSkills"
      WHERE "SkillId" = $1
    `, { skillId });

  return result.recordset;
};

// Add skill to project
const createProjectSkill = async (projectId, skillId) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      INSERT INTO portfolio.ProjectSkills
      (ProjectId, SkillId)
      OUTPUT INSERTED.*
      VALUES
      (@projectId, @skillId)
    `,
    `
      INSERT INTO portfolio."ProjectSkills" ("ProjectId", "SkillId")
      VALUES ($1, $2)
      RETURNING *
    `,
    { projectId, skillId },
  );

  return result.recordset[0];
};

// Delete skill from project
const deleteProjectSkill = async (projectId, skillId) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      DELETE FROM portfolio.ProjectSkills
      OUTPUT DELETED.*
      WHERE ProjectId = @projectId
      AND SkillId = @skillId
    `,
    `
      DELETE FROM portfolio."ProjectSkills"
      WHERE "ProjectId" = $1
      AND "SkillId" = $2
      RETURNING *
    `,
    { projectId, skillId },
  );

  return result.recordset[0];
};

module.exports = {
  getAllProjectSkills,
  getSkillsByProjectId,
  getProjectsBySkillId,
  createProjectSkill,
  deleteProjectSkill,
};
