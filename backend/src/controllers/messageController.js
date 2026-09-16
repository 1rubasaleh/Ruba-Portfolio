const {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("../models/messageModel");

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();

    res.json(messages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting messages",
    });
  }
};

// Get message by ID
const getMessageByIdController = async (req, res) => {
  try {
    const message = await getMessageById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json(message);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting message",
    });
  }
};

// Create message
const createMessageController = async (req, res) => {
  try {
    const { name, email, subject, content } = req.body;

    const message = await createMessage(name, email, subject, content);

    res.status(201).json(message);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating message",
    });
  }
};

// Update message
const updateMessageController = async (req, res) => {
  try {
    const { name, email, subject, content, isRead } = req.body;

    const message = await updateMessage(
      req.params.id,
      name,
      email,
      subject,
      content,
      isRead,
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json(message);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating message",
    });
  }
};

// Delete message
const deleteMessageController = async (req, res) => {
  try {
    const message = await deleteMessage(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message deleted successfully",
      messageData: message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting message",
    });
  }
};

module.exports = {
  getMessages,
  getMessageById: getMessageByIdController,
  createMessage: createMessageController,
  updateMessage: updateMessageController,
  deleteMessage: deleteMessageController,
};
