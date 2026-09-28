const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  getSkillCategories,
  getSkillCategoryById,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} = require("../controllers/skillCategoryController.js");

router.get("/", getSkillCategories);

router.get("/:id", getSkillCategoryById);

router.post("/", authMiddleware, authorize(1), createSkillCategory);

router.put("/:id", authMiddleware, authorize(1), updateSkillCategory);

router.delete("/:id", authMiddleware, authorize(1), deleteSkillCategory);

module.exports = router;
