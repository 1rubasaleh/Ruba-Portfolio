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

router.post("/", authMiddleware, authorize("admin"), createSkillCategory);

router.put("/:id", authMiddleware, authorize("admin"), updateSkillCategory);

router.delete("/:id", authMiddleware, authorize("admin"), deleteSkillCategory);

module.exports = router;
