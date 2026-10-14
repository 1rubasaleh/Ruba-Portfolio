const connectDB = require("../config/db");
const runQuery = require("../config/query");

const getAllSkillCategories = async () => {
  const pool = await connectDB();
  const result = await runQuery(pool, `
    SELECT CategoryId, CategoryName
    FROM portfolio.SkillCategories
    ORDER BY CategoryName
  `, `
    SELECT "CategoryId", "CategoryName"
    FROM portfolio."SkillCategories"
    ORDER BY "CategoryName"
  `);
  return result.recordset;
};

const getSkillCategoryById = async (id) => {
  const pool = await connectDB();
  const result = await runQuery(pool, `
    SELECT CategoryId, CategoryName
    FROM portfolio.SkillCategories
    WHERE CategoryId = @id
  `, `
    SELECT "CategoryId", "CategoryName"
    FROM portfolio."SkillCategories"
    WHERE "CategoryId" = $1
  `, { id });
  return result.recordset[0];
};

const createSkillCategory = async (categoryName) => {
  const pool = await connectDB();
  const result = await runQuery(pool, `
    INSERT INTO portfolio.SkillCategories (CategoryName)
    OUTPUT INSERTED.CategoryId, INSERTED.CategoryName
    VALUES (@categoryName)
  `, `
    INSERT INTO portfolio."SkillCategories" ("CategoryName")
    VALUES ($1)
    RETURNING "CategoryId", "CategoryName"
  `, { categoryName });
  return result.recordset[0];
};

const updateSkillCategory = async (id, categoryName) => {
  const pool = await connectDB();
  const result = await runQuery(pool, `
      UPDATE portfolio.SkillCategories
      SET CategoryName = @categoryName
      OUTPUT INSERTED.CategoryId, INSERTED.CategoryName
      WHERE CategoryId = @id
    `, `
      UPDATE portfolio."SkillCategories"
      SET "CategoryName" = $2
      WHERE "CategoryId" = $1
      RETURNING "CategoryId", "CategoryName"
    `, { id, categoryName });
  return result.recordset[0];
};

const deleteSkillCategory = async (id) => {
  const pool = await connectDB();
  const result = await runQuery(pool, `
    DELETE FROM portfolio.SkillCategories
    OUTPUT DELETED.CategoryId, DELETED.CategoryName
    WHERE CategoryId = @id
  `, `
    DELETE FROM portfolio."SkillCategories"
    WHERE "CategoryId" = $1
    RETURNING "CategoryId", "CategoryName"
  `, { id });
  return result.recordset[0];
};

module.exports = {
  getAllSkillCategories,
  getSkillCategoryById,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
};
