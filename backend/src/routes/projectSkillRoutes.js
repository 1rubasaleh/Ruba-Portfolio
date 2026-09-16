const express = require("express");

const router = express.Router();

const {
  getProjectSkills,
  getSkillsByProjectId,
  getProjectsBySkillId,
  createProjectSkill,
  deleteProjectSkill,
} = require("../controllers/projectSkillController.js");

router.get("/", getProjectSkills);

router.get("/project/:projectId", getSkillsByProjectId);

router.get("/skill/:skillId", getProjectsBySkillId);

router.post("/", createProjectSkill);

router.delete("/:projectId/:skillId", deleteProjectSkill);

module.exports = router;
