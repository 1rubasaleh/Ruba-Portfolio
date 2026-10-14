const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getFavorites,
  getFavoritesByUserId,
  getUsersByProjectId,
  createFavorite,
  deleteFavorite,
} = require("../controllers/favoriteController.js");

router.get("/", authMiddleware, authorize("admin"), getFavorites);

router.get(
  "/user/:userId",
  authMiddleware,
  (req, res, next) => {
    if (
      String(req.user.userId) !== req.params.userId &&
      String(req.user.roleName).toLowerCase() !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    return next();
  },
  getFavoritesByUserId,
);

router.get(
  "/project/:projectId",
  authMiddleware,
  authorize("admin"),
  getUsersByProjectId,
);

router.post("/", authMiddleware, createFavorite);

router.delete("/:projectId", authMiddleware, deleteFavorite);
module.exports = router;
