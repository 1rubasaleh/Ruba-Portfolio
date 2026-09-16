const express = require("express");

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

router.delete("/:id", deleteMessage);

module.exports = router;
