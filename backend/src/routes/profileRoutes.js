const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController.js");

router.get("/", getProfiles);

router.get("/:id", getProfileById);

router.post("/", authMiddleware, authorize(1), createProfile);

router.put("/:id", authMiddleware, authorize(1), updateProfile);

router.delete("/:id", authMiddleware, authorize(1), deleteProfile);

module.exports = router;
