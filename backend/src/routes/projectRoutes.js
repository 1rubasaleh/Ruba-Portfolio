const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", authMiddleware, authorize(1), createProject);
router.put("/:id", authMiddleware, authorize(1), updateProject);
router.delete("/:id", authMiddleware, authorize(1), deleteProject);
module.exports = router;
