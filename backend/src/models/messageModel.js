const connectDB = require("../config/db");
const runQuery = require("../config/query");

// Get all messages
const getAllMessages = async () => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Messages",
    'SELECT * FROM portfolio."Messages"',
  );

  return result.recordset;
};

// Get message by ID
const getMessageById = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    "SELECT * FROM portfolio.Messages WHERE MessageId = @id",
    'SELECT * FROM portfolio."Messages" WHERE "MessageId" = $1',
    { id },
  );

  return result.recordset[0];
};

// Create message
const createMessage = async (name, email, subject, content) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      INSERT INTO portfolio.Messages
      (Name, Email, Subject, Content)
      OUTPUT INSERTED.*
      VALUES
      (@name, @email, @subject, @content)
    `,
    `
      INSERT INTO portfolio."Messages"
      ("Name", "Email", "Subject", "Content")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    { name, email, subject, content },
  );

  return result.recordset[0];
};

// Update message
const updateMessage = async (id, name, email, subject, content, isRead) => {
  const pool = await connectDB();

  const result = await runQuery(
    pool,
    `
      UPDATE portfolio.Messages
      SET
        Name = @name,
        Email = @email,
        Subject = @subject,
        Content = @content,
        IsRead = @isRead
      OUTPUT INSERTED.*
      WHERE MessageId = @id
    `,
    `
      UPDATE portfolio."Messages"
      SET
        "Name" = $2,
        "Email" = $3,
        "Subject" = $4,
        "Content" = $5,
        "IsRead" = $6
      WHERE "MessageId" = $1
      RETURNING *
    `,
    { id, name, email, subject, content, isRead },
  );

  return result.recordset[0];
};

// Delete message
const deleteMessage = async (id) => {
  const pool = await connectDB();

  const result = await runQuery(pool, `
      DELETE FROM portfolio.Messages
      OUTPUT DELETED.*
      WHERE MessageId = @id
    `, `
      DELETE FROM portfolio."Messages"
      WHERE "MessageId" = $1
      RETURNING *
    `, { id });

  return result.recordset[0];
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
};
