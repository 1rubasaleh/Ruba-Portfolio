const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController.js");

router.get("/", getUsers);

router.get("/:id", getUserById);

router.post("/", authMiddleware, authorize(1), createUser);

router.put("/:id", authMiddleware, authorize(1), updateUser);

router.delete("/:id", authMiddleware, authorize(1), deleteUser);

module.exports = router;
