const {
  getAllProjects,
  getProjectById: getProjectByIdModel,
  createProject: createProjectModel,
  updateProject: updateProjectModel,
  deleteProject: deleteProjectModel,
} = require("../models/projectModel");

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();

    res.json(projects);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting projects",
    });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await getProjectByIdModel(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting project",
    });
  }
};

// Create project
const createProject = async (req, res) => {
  try {
    const { title, description, imageUrl, githubUrl, liveUrl } = req.body;

    const project = await createProjectModel(
      title,
      description,
      imageUrl,
      githubUrl,
      liveUrl,
    );

    res.status(201).json(project);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating project",
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { title, description, imageUrl, githubUrl, liveUrl } = req.body;

    const project = await updateProjectModel(
      req.params.id,
      title,
      description,
      imageUrl,
      githubUrl,
      liveUrl,
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating project",
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await deleteProjectModel(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
      project,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting project",
    });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
