const connectDB = require("../config/db");
const runQuery = require("../config/query");

const getAllProjects = async () => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Projects",
    'SELECT * FROM portfolio."Projects"',
  );

  return result.recordset;
};

const getProjectById = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Projects WHERE ProjectId = @id",
    'SELECT * FROM portfolio."Projects" WHERE "ProjectId" = $1',
    { id },
  );

  return result.recordset[0];
};

const createProject = async (
  title,
  description,
  imageUrl,
  githubUrl,
  liveUrl,
) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      INSERT INTO portfolio.Projects
      (Title, Description, ImageUrl, GitHubUrl, LiveUrl)
      OUTPUT INSERTED.*
      VALUES
      (@title, @description, @imageUrl, @githubUrl, @liveUrl)
    `,
    `
      INSERT INTO portfolio."Projects"
      ("Title", "Description", "ImageUrl", "GitHubUrl", "LiveUrl")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    { title, description, imageUrl, githubUrl, liveUrl },
  );

  return result.recordset[0];
};

const updateProject = async (
  id,
  title,
  description,
  imageUrl,
  githubUrl,
  liveUrl,
) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      UPDATE portfolio.Projects
      SET
        Title = @title,
        Description = @description,
        ImageUrl = @imageUrl,
        GitHubUrl = @githubUrl,
        LiveUrl = @liveUrl
      OUTPUT INSERTED.*
      WHERE ProjectId = @id
    `,
    `
      UPDATE portfolio."Projects"
      SET
        "Title" = $2,
        "Description" = $3,
        "ImageUrl" = $4,
        "GitHubUrl" = $5,
        "LiveUrl" = $6
      WHERE "ProjectId" = $1
      RETURNING *
    `,
    { id, title, description, imageUrl, githubUrl, liveUrl },
  );

  return result.recordset[0];
};

const deleteProject = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      DELETE FROM portfolio.Projects
      OUTPUT DELETED.*
      WHERE ProjectId = @id
    `, `
      DELETE FROM portfolio."Projects"
      WHERE "ProjectId" = $1
      RETURNING *
    `, { id });

  return result.recordset[0];
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
