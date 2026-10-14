const {
  getAllSkillCategories,
  getSkillCategoryById,
  createSkillCategory: createSkillCategoryModel,
  updateSkillCategory: updateSkillCategoryModel,
  deleteSkillCategory: deleteSkillCategoryModel,
} = require("../models/skillCategoryModel");

const getSkillCategories = async (req, res) => {
  try {
    res.json(await getAllSkillCategories());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting skill categories" });
  }
};

const getSkillCategoryByIdController = async (req, res) => {
  try {
    const category = await getSkillCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Skill category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting skill category" });
  }
};

const createSkillCategory = async (req, res) => {
  const categoryName =
    typeof req.body?.categoryName === "string"
      ? req.body.categoryName.trim()
      : "";
  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }
  try {
    res.status(201).json(await createSkillCategoryModel(categoryName));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating skill category" });
  }
};

const updateSkillCategory = async (req, res) => {
  const categoryName =
    typeof req.body?.categoryName === "string"
      ? req.body.categoryName.trim()
      : "";
  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }
  try {
    const category = await updateSkillCategoryModel(
      req.params.id,
      categoryName,
    );
    if (!category) {
      return res.status(404).json({ message: "Skill category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating skill category" });
  }
};

const deleteSkillCategory = async (req, res) => {
  try {
    const category = await deleteSkillCategoryModel(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Skill category not found" });
    }
    res.json({ message: "Skill category deleted successfully", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting skill category" });
  }
};

module.exports = {
  getSkillCategories,
  getSkillCategoryById: getSkillCategoryByIdController,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
};
