const connectDB = require("../config/db");

// Get all messages
const getAllMessages = async () => {
  const pool = await connectDB();

  const result = await pool.request().query("SELECT * FROM portfolio.Messages");

  return result.recordset;
};

// Get message by ID
const getMessageById = async (id) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM portfolio.Messages WHERE MessageId = @id");

  return result.recordset[0];
};

// Create message
const createMessage = async (name, email, subject, content) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("name", name)
    .input("email", email)
    .input("subject", subject)
    .input("content", content).query(`
      INSERT INTO portfolio.Messages
      (Name, Email, Subject, Content)
      OUTPUT INSERTED.*
      VALUES
      (@name, @email, @subject, @content)
    `);

  return result.recordset[0];
};

// Update message
const updateMessage = async (id, name, email, subject, content, isRead) => {
  const pool = await connectDB();

  const result = await pool
    .request()
    .input("id", id)
    .input("name", name)
    .input("email", email)
    .input("subject", subject)
    .input("content", content)
    .input("isRead", isRead).query(`
      UPDATE portfolio.Messages
      SET
        Name = @name,
        Email = @email,
        Subject = @subject,
        Content = @content,
        IsRead = @isRead
      OUTPUT INSERTED.*
      WHERE MessageId = @id
    `);

  return result.recordset[0];
};

// Delete message
const deleteMessage = async (id) => {
  const pool = await connectDB();

  const result = await pool.request().input("id", id).query(`
      DELETE FROM portfolio.Messages
      OUTPUT DELETED.*
      WHERE MessageId = @id
    `);

  return result.recordset[0];
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
};
