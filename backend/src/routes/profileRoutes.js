const express = require("express");

const router = express.Router();

const {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController.js");

router.get("/", getProfiles);

router.get("/:id", getProfileById);

router.post("/", createProfile);

router.put("/:id", updateProfile);

router.delete("/:id", deleteProfile);

module.exports = router;
