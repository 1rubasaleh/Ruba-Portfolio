const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require("../controllers/roleController.js");

router.get("/", getRoles);

router.get("/:id", getRoleById);

router.post("/", authMiddleware, authorize(1), createRole);

router.put("/:id", authMiddleware, authorize(1), updateRole);

router.delete("/:id", authMiddleware, authorize(1), deleteRole);

module.exports = router;
