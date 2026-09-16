const express = require("express");

const router = express.Router();

const {
  getSkillCategories,
  getSkillCategoryById,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} = require("../controllers/skillCategoryController.js");

router.get("/", getSkillCategories);

router.get("/:id", getSkillCategoryById);

router.post("/", createSkillCategory);

router.put("/:id", updateSkillCategory);

router.delete("/:id", deleteSkillCategory);

module.exports = router;
