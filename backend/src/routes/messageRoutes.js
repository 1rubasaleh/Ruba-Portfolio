const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const router = express.Router();
const {
  getMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController.js");

router.get("/", authMiddleware, authorize("admin"), getMessages);

router.get("/:id", authMiddleware, authorize("admin"), getMessageById);

router.post("/", createMessage);

router.put("/:id", authMiddleware, authorize("admin"), updateMessage);

router.delete("/:id", authMiddleware, authorize("admin"), deleteMessage);

module.exports = router;
