const {
  getAllProjectSkills,
  getSkillsByProjectId,
  getProjectsBySkillId,
  createProjectSkill,
  deleteProjectSkill,
} = require("../models/projectSkillModel");

// Get all project skills
const getProjectSkills = async (req, res) => {
  try {
    const projectSkills = await getAllProjectSkills();

    res.json(projectSkills);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting project skills",
    });
  }
};

// Get skills by project ID
const getSkillsByProjectIdController = async (req, res) => {
  try {
    const skills = await getSkillsByProjectId(req.params.projectId);

    res.json(skills);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting skills for project",
    });
  }
};

// Get projects by skill ID
const getProjectsBySkillIdController = async (req, res) => {
  try {
    const projects = await getProjectsBySkillId(req.params.skillId);

    res.json(projects);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting projects for skill",
    });
  }
};

// Add skill to project
const createProjectSkillController = async (req, res) => {
  try {
    const { projectId, skillId } = req.body;

    const projectSkill = await createProjectSkill(projectId, skillId);

    res.status(201).json(projectSkill);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error adding skill to project",
    });
  }
};

// Remove skill from project
const deleteProjectSkillController = async (req, res) => {
  try {
    const projectSkill = await deleteProjectSkill(
      req.params.projectId,
      req.params.skillId,
    );

    if (!projectSkill) {
      return res.status(404).json({
        message: "Project skill relationship not found",
      });
    }

    res.json({
      message: "Skill removed from project successfully",
      projectSkill,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error removing skill from project",
    });
  }
};

module.exports = {
  getProjectSkills,
  getSkillsByProjectId: getSkillsByProjectIdController,
  getProjectsBySkillId: getProjectsBySkillIdController,
  createProjectSkill: createProjectSkillController,
  deleteProjectSkill: deleteProjectSkillController,
};
