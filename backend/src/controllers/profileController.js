const {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../models/profileModel");

// Get all profiles
const getProfiles = async (req, res) => {
  try {
    const profiles = await getAllProfiles();

    res.json(profiles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting profiles",
    });
  }
};

// Get profile by ID
const getProfileByIdController = async (req, res) => {
  try {
    const profile = await getProfileById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting profile",
    });
  }
};

// Create profile
const createProfileController = async (req, res) => {
  try {
    const { userId, fullName, title, bio, imageUrl, location, cvUrl } =
      req.body;

    const profile = await createProfile(
      userId,
      fullName,
      title,
      bio,
      imageUrl,
      location,
      cvUrl,
    );

    res.status(201).json(profile);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating profile",
    });
  }
};

// Update profile
const updateProfileController = async (req, res) => {
  try {
    const { userId, fullName, title, bio, imageUrl, location, cvUrl } =
      req.body;

    const profile = await updateProfile(
      req.params.id,
      userId,
      fullName,
      title,
      bio,
      imageUrl,
      location,
      cvUrl,
    );

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating profile",
    });
  }
};

// Delete profile
const deleteProfileController = async (req, res) => {
  try {
    const profile = await deleteProfile(req.params.id);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
      message: "Profile deleted successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting profile",
    });
  }
};

module.exports = {
  getProfiles,
  getProfileById: getProfileByIdController,
  createProfile: createProfileController,
  updateProfile: updateProfileController,
  deleteProfile: deleteProfileController,
};
