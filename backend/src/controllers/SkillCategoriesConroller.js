const {
  getAllSkillCategories,
  getSkillCategoryById,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} = require("../models/skillCategoryModel");

// Get all skill categories
const getSkillCategories = async (req, res) => {
  try {
    const categories = await getAllSkillCategories();

    res.json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting skill categories",
    });
  }
};

// Get skill category by ID
const getSkillCategoryByIdController = async (req, res) => {
  try {
    const category = await getSkillCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Skill category not found",
      });
    }

    res.json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting skill category",
    });
  }
};

// Create skill category
const createSkillCategoryController = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const category = await createSkillCategory(categoryName);

    res.status(201).json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating skill category",
    });
  }
};

// Update skill category
const updateSkillCategoryController = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const category = await updateSkillCategory(req.params.id, categoryName);

    if (!category) {
      return res.status(404).json({
        message: "Skill category not found",
      });
    }

    res.json(category);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating skill category",
    });
  }
};

// Delete skill category
const deleteSkillCategoryController = async (req, res) => {
  try {
    const category = await deleteSkillCategory(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Skill category not found",
      });
    }

    res.json({
      message: "Skill category deleted successfully",
      category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting skill category",
    });
  }
};

module.exports = {
  getSkillCategories,
  getSkillCategoryById: getSkillCategoryByIdController,
  createSkillCategory: createSkillCategoryController,
  updateSkillCategory: updateSkillCategoryController,
  deleteSkillCategory: deleteSkillCategoryController,
};
