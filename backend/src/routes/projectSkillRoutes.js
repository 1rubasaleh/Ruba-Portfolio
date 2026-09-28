const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
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

router.post("/", authMiddleware, authorize(1), createProjectSkill);

router.delete(
  "/:projectId/:skillId",
  authMiddleware,
  authorize(1),
  deleteProjectSkill,
);

module.exports = router;
