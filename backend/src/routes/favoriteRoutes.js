const express = require("express");

const router = express.Router();

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

router.post("/", createFavorite);

router.delete("/:userId/:projectId", deleteFavorite);

module.exports = router;
