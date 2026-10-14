const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  getExperiences,
  getExperienceById,
  getExperiencesByProfileId,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController.js");

router.get("/", getExperiences);

router.get("/profile/:profileId", getExperiencesByProfileId);

router.get("/:id", getExperienceById);

router.post("/", authMiddleware, authorize("admin"), createExperience);

router.put("/:id", authMiddleware, authorize("admin"), updateExperience);

router.delete("/:id", authMiddleware, authorize("admin"), deleteExperience);

module.exports = router;
