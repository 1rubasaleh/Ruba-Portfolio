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

router.post("/", authMiddleware, authorize("admin"), createProfile);

router.put("/:id", authMiddleware, authorize("admin"), updateProfile);

router.delete("/:id", authMiddleware, authorize("admin"), deleteProfile);

module.exports = router;
