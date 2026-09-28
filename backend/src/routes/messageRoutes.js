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

router.get("/", getMessages);

router.get("/:id", getMessageById);

router.post("/", createMessage);

router.put("/:id", updateMessage);

router.delete("/:id", authMiddleware, authorize(1), deleteMessage);

module.exports = router;
