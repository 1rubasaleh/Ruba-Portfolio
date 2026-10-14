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

router.post("/", authMiddleware, authorize("admin"), createProjectSkill);

router.delete(
  "/:projectId/:skillId",
  authMiddleware,
  authorize("admin"),
  deleteProjectSkill,
);

module.exports = router;
