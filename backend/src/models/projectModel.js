const connectDB = require("../config/db");

const getAllProjects = async () => {
  const pool = await connectDB();

  const result = await pool.request().query("SELECT * FROM portfolio.Projects");

  return result.recordset;
};

const getProjectById = async (id) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM portfolio.Projects WHERE ProjectId = @id");

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

  const result = await pool
    .request()
    .input("title", title)
    .input("description", description)
    .input("imageUrl", imageUrl)
    .input("githubUrl", githubUrl)
    .input("liveUrl", liveUrl).query(`
      INSERT INTO portfolio.Projects
      (Title, Description, ImageUrl, GitHubUrl, LiveUrl)
      OUTPUT INSERTED.*
      VALUES
      (@title, @description, @imageUrl, @githubUrl, @liveUrl)
    `);

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

  const result = await pool
    .request()
    .input("id", id)
    .input("title", title)
    .input("description", description)
    .input("imageUrl", imageUrl)
    .input("githubUrl", githubUrl)
    .input("liveUrl", liveUrl).query(`
      UPDATE portfolio.Projects
      SET
        Title = @title,
        Description = @description,
        ImageUrl = @imageUrl,
        GitHubUrl = @githubUrl,
        LiveUrl = @liveUrl
      OUTPUT INSERTED.*
      WHERE ProjectId = @id
    `);

  return result.recordset[0];
};

const deleteProject = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.Projects
      OUTPUT DELETED.*
      WHERE ProjectId = @id
    `);

  return result.recordset[0];
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
