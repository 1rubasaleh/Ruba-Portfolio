const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../models/skillModel");

// Get all skills
const getSkills = async (req, res) => {
  try {
    const skills = await getAllSkills();

    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error getting skills",
    });
  }
};

// Get skill by ID
const getSkillByIdController = async (req, res) => {
  try {
    const skill = await getSkillById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error getting skill",
    });
  }
};

// Create skill
const createSkillController = async (req, res) => {
  try {
    const { name, categoryId, iconUrl } = req.body;

    const skill = await createSkill(name, categoryId, iconUrl);

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating skill",
    });
  }
};

// Update skill
const updateSkillController = async (req, res) => {
  try {
    const { name, categoryId, iconUrl } = req.body;

    const skill = await updateSkill(req.params.id, name, categoryId, iconUrl);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating skill",
    });
  }
};

// Delete skill
const deleteSkillController = async (req, res) => {
  try {
    const skill = await deleteSkill(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.json({
      message: "Skill deleted successfully",
      skill,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting skill",
    });
  }
};

module.exports = {
  getSkills,
  getSkillById: getSkillByIdController,
  createSkill: createSkillController,
  updateSkill: updateSkillController,
  deleteSkill: deleteSkillController,
};
