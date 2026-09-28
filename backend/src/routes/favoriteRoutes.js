const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getFavorites,
  getFavoritesByUserId,
  getUsersByProjectId,
  createFavorite,
  deleteFavorite,
} = require("../controllers/favoriteController.js");

router.get("/", getFavorites);

router.get("/user/:userId", getFavoritesByUserId);

router.get("/project/:projectId", getUsersByProjectId);

router.post("/", authMiddleware, createFavorite);

router.delete("/:projectId", authMiddleware, deleteFavorite);
module.exports = router;
