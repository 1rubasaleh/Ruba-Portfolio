const express = require("express");

const router = express.Router();

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

router.post("/", createEducation);

router.put("/:id", updateEducation);

router.delete("/:id", deleteEducation);

module.exports = router;
