const connectDB = require("../config/db");

const getAllSkillCategories = async () => {
  const pool = await connectDB();
  const result = await pool.request().query(`
    SELECT CategoryId, CategoryName
    FROM portfolio.SkillCategories
    ORDER BY CategoryName
  `);
  return result.recordset;
};

const getSkillCategoryById = async (id) => {
  const pool = await connectDB();
  const result = await pool.request().input("id", id).query(`
    SELECT CategoryId, CategoryName
    FROM portfolio.SkillCategories
    WHERE CategoryId = @id
  `);
  return result.recordset[0];
};

const createSkillCategory = async (categoryName) => {
  const pool = await connectDB();
  const result = await pool.request().input("categoryName", categoryName).query(`
    INSERT INTO portfolio.SkillCategories (CategoryName)
    OUTPUT INSERTED.CategoryId, INSERTED.CategoryName
    VALUES (@categoryName)
  `);
  return result.recordset[0];
};

const updateSkillCategory = async (id, categoryName) => {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("id", id)
    .input("categoryName", categoryName).query(`
      UPDATE portfolio.SkillCategories
      SET CategoryName = @categoryName
      OUTPUT INSERTED.CategoryId, INSERTED.CategoryName
      WHERE CategoryId = @id
    `);
  return result.recordset[0];
};

const deleteSkillCategory = async (id) => {
  const pool = await connectDB();
  const result = await pool.request().input("id", id).query(`
    DELETE FROM portfolio.SkillCategories
    OUTPUT DELETED.CategoryId, DELETED.CategoryName
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
