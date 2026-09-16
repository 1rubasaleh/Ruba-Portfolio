const express = require("express");

const router = express.Router();

const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController.js");

router.get("/", getSkills);

router.get("/:id", getSkillById);

router.post("/", createSkill);

router.put("/:id", updateSkill);

router.delete("/:id", deleteSkill);

module.exports = router;
