const connectDB = require("../config/db");
const runQuery = require("../config/query");

// Get all skills
const getAllSkills = async () => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
    SELECT s.*, c.CategoryName
    FROM portfolio.Skills AS s
    LEFT JOIN portfolio.SkillCategories AS c ON c.CategoryId = s.CategoryId
  `, `
    SELECT s.*, c."CategoryName"
    FROM portfolio."Skills" AS s
    LEFT JOIN portfolio."SkillCategories" AS c
      ON c."CategoryId" = s."CategoryId"
  `);

  return result.recordset;
};

// Get skill by ID
const getSkillById = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      SELECT s.*, c.CategoryName
      FROM portfolio.Skills AS s
      LEFT JOIN portfolio.SkillCategories AS c ON c.CategoryId = s.CategoryId
      WHERE s.SkillId = @id
    `, `
      SELECT s.*, c."CategoryName"
      FROM portfolio."Skills" AS s
      LEFT JOIN portfolio."SkillCategories" AS c
        ON c."CategoryId" = s."CategoryId"
      WHERE s."SkillId" = $1
    `, { id });

  return result.recordset[0];
};

// Create skill
const createSkill = async (name, categoryId, iconUrl) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      INSERT INTO portfolio.Skills
      (Name, CategoryId, IconUrl)
      OUTPUT INSERTED.*
      VALUES
      (@name, @categoryId, @iconUrl)
    `,
    `
      INSERT INTO portfolio."Skills" ("Name", "CategoryId", "IconUrl")
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    { name, categoryId, iconUrl },
  );

  return result.recordset[0];
};

// Update skill
const updateSkill = async (id, name, categoryId, iconUrl) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      UPDATE portfolio.Skills
      SET
        Name = @name,
        CategoryId = @categoryId,
        IconUrl = @iconUrl
      OUTPUT INSERTED.*
      WHERE SkillId = @id
    `,
    `
      UPDATE portfolio."Skills"
      SET "Name" = $2, "CategoryId" = $3, "IconUrl" = $4
      WHERE "SkillId" = $1
      RETURNING *
    `,
    { id, name, categoryId, iconUrl },
  );

  return result.recordset[0];
};

// Delete skill
const deleteSkill = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      DELETE FROM portfolio.Skills
      OUTPUT DELETED.*
      WHERE SkillId = @id
    `, `
      DELETE FROM portfolio."Skills"
      WHERE "SkillId" = $1
      RETURNING *
    `, { id });

  return result.recordset[0];
};

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
