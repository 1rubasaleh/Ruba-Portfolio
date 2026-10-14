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

router.post("/", authMiddleware, authorize("admin"), createSkill);

router.put("/:id", authMiddleware, authorize("admin"), updateSkill);

router.delete("/:id", authMiddleware, authorize("admin"), deleteSkill);

module.exports = router;
