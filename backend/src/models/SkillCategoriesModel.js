const connectDB = require("../config/db");

// Get all skill categories
const getAllSkillCategories = async () => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .query("SELECT * FROM portfolio.SkillCategories");

  return result.recordset;
};

// Get skill category by ID
const getSkillCategoryById = async (id) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM portfolio.SkillCategories WHERE CategoryId = @id");

  return result.recordset[0];
};

// Create skill category
const createSkillCategory = async (categoryName) => {
  const pool = await connectDB();

  const result = await pool.request().input("categoryName", categoryName)
    .query(`
      INSERT INTO portfolio.SkillCategories
      (CategoryName)
      OUTPUT INSERTED.*
      VALUES (@categoryName)
    `);

  return result.recordset[0];
};

// Update skill category
const updateSkillCategory = async (id, categoryName) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .input("categoryName", categoryName).query(`
      UPDATE portfolio.SkillCategories
      SET CategoryName = @categoryName
      OUTPUT INSERTED.*
      WHERE CategoryId = @id
    `);

  return result.recordset[0];
};

// Delete skill category
const deleteSkillCategory = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.SkillCategories
      OUTPUT DELETED.*
      WHERE CategoryId = @id
    `);

  return result.recordset[0];
};

module.exports = {
  getAllSkillCategories,
  getSkillCategoryById,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
};
