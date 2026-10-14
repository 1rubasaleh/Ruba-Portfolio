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

router.use(authMiddleware, authorize("admin"));

router.get("/", getRoles);

router.get("/:id", getRoleById);

router.post("/", createRole);

router.put("/:id", updateRole);

router.delete("/:id", deleteRole);

module.exports = router;
