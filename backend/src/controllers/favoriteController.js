const {
  getAllFavorites,
  getFavoritesByUserId,
  getUsersByProjectId,
  createFavorite,
  deleteFavorite,
} = require("../models/favoriteModel");

// Get all favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await getAllFavorites();

    res.json(favorites);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting favorites",
    });
  }
};

// Get favorites by user ID
const getFavoritesByUserIdController = async (req, res) => {
  try {
    const favorites = await getFavoritesByUserId(req.params.userId);

    res.json(favorites);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting user favorites",
    });
  }
};

// Get users by project ID
const getUsersByProjectIdController = async (req, res) => {
  try {
    const users = await getUsersByProjectId(req.params.projectId);

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting project favorites",
    });
  }
};

// Add favorite
const createFavoriteController = async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    const favorite = await createFavorite(userId, projectId);

    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error adding favorite",
    });
  }
};

// Remove favorite
const deleteFavoriteController = async (req, res) => {
  try {
    const favorite = await deleteFavorite(
      req.params.userId,
      req.params.projectId,
    );

    if (!favorite) {
      return res.status(404).json({
        message: "Favorite not found",
      });
    }

    res.json({
      message: "Favorite removed successfully",
      favorite,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error removing favorite",
    });
  }
};

module.exports = {
  getFavorites,
  getFavoritesByUserId: getFavoritesByUserIdController,
  getUsersByProjectId: getUsersByProjectIdController,
  createFavorite: createFavoriteController,
  deleteFavorite: deleteFavoriteController,
};
