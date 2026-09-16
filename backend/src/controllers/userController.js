const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../models/userModel");

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting users",
    });
  }
};

// Get user by ID
const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting user",
    });
  }
};

// Create user
const createUserController = async (req, res) => {
  try {
    const { name, email, passwordHash, roleId } = req.body;

    const user = await createUser(name, email, passwordHash, roleId);

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating user",
    });
  }
};

// Update user
const updateUserController = async (req, res) => {
  try {
    const { name, email, passwordHash, roleId } = req.body;

    const user = await updateUser(
      req.params.id,
      name,
      email,
      passwordHash,
      roleId,
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating user",
    });
  }
};

// Delete user
const deleteUserController = async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting user",
    });
  }
};

module.exports = {
  getUsers,
  getUserById: getUserByIdController,
  createUser: createUserController,
  updateUser: updateUserController,
  deleteUser: deleteUserController,
};
