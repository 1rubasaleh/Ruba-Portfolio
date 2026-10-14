const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getEducation,
  getEducationById,
  getEducationByProfileId,
  createEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/educationController.js");

router.get("/", getEducation);

router.get("/:id", getEducationById);

router.get("/profile/:profileId", getEducationByProfileId);

router.post("/", authMiddleware, authorize("admin"), createEducation);

router.put("/:id", authMiddleware, authorize("admin"), updateEducation);

router.delete("/:id", authMiddleware, authorize("admin"), deleteEducation);

module.exports = router;
