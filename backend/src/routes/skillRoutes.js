const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController.js");

router.get("/", getSkills);

router.get("/:id", getSkillById);

router.post("/", authMiddleware, authorize(1), createSkill);

router.put("/:id", authMiddleware, authorize(1), updateSkill);

router.delete("/:id", authMiddleware, authorize(1), deleteSkill);

module.exports = router;
