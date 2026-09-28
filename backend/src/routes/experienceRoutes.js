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

router.post("/", authMiddleware, authorize(1), createExperience);

router.put("/:id", authMiddleware, authorize(1), updateExperience);

router.delete("/:id", authMiddleware, authorize(1), deleteExperience);

module.exports = router;
