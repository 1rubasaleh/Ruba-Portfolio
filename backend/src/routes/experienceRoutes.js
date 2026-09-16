const express = require("express");

const router = express.Router();

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

router.post("/", createExperience);

router.put("/:id", updateExperience);

router.delete("/:id", deleteExperience);

module.exports = router;
