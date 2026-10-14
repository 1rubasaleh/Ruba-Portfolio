const connectDB = require("../config/db");

// Get all skills
const getAllSkills = async () => {
  const pool = await connectDB();

  const result = await pool.request().query(`
    SELECT s.*, c.CategoryName
    FROM portfolio.Skills AS s
    LEFT JOIN portfolio.SkillCategories AS c ON c.CategoryId = s.CategoryId
  `);

  return result.recordset;
};

// Get skill by ID
const getSkillById = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      SELECT s.*, c.CategoryName
      FROM portfolio.Skills AS s
      LEFT JOIN portfolio.SkillCategories AS c ON c.CategoryId = s.CategoryId
      WHERE s.SkillId = @id
    `);

  return result.recordset[0];
};

// Create skill
const createSkill = async (name, categoryId, iconUrl) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("name", name)
    .input("categoryId", categoryId)
    .input("iconUrl", iconUrl).query(`
      INSERT INTO portfolio.Skills
      (Name, CategoryId, IconUrl)
      OUTPUT INSERTED.*
      VALUES
      (@name, @categoryId, @iconUrl)
    `);

  return result.recordset[0];
};

// Update skill
const updateSkill = async (id, name, categoryId, iconUrl) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .input("name", name)
    .input("categoryId", categoryId)
    .input("iconUrl", iconUrl).query(`
      UPDATE portfolio.Skills
      SET
        Name = @name,
        CategoryId = @categoryId,
        IconUrl = @iconUrl
      OUTPUT INSERTED.*
      WHERE SkillId = @id
    `);

  return result.recordset[0];
};

// Delete skill
const deleteSkill = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.Skills
      OUTPUT DELETED.*
      WHERE SkillId = @id
    `);

  return result.recordset[0];
};

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
