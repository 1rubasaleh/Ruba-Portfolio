const {
  getAllExperiences,
  getExperienceById,
  getExperiencesByProfileId,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../models/experienceModel");

// Get all experiences
const getExperiences = async (req, res) => {
  try {
    const experiences = await getAllExperiences();

    res.json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting experiences" });
  }
};

// Get experience by ID
const getExperienceByIdController = async (req, res) => {
  try {
    const experience = await getExperienceById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error getting experience",
    });
  }
};

// Get experiences by profile ID
const getExperiencesByProfileIdController = async (req, res) => {
  try {
    const experiences = await getExperiencesByProfileId(req.params.profileId);

    res.json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error getting experiences by profile",
    });
  }
};

// Create experience
const createExperienceController = async (req, res) => {
  try {
    const {
      profileId,
      companyName,
      position,
      startDate,
      endDate,
      description,
    } = req.body;

    const experience = await createExperience(
      profileId,
      companyName,
      position,
      startDate,
      endDate,
      description,
    );

    res.status(201).json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating experience",
    });
  }
};

// Update experience
const updateExperienceController = async (req, res) => {
  try {
    const {
      profileId,
      companyName,
      position,
      startDate,
      endDate,
      description,
    } = req.body;

    const experience = await updateExperience(
      req.params.id,
      profileId,
      companyName,
      position,
      startDate,
      endDate,
      description,
    );

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating experience",
    });
  }
};

// Delete experience
const deleteExperienceController = async (req, res) => {
  try {
    const experience = await deleteExperience(req.params.id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.json({
      message: "Experience deleted successfully",
      experience,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting experience",
    });
  }
};

module.exports = {
  getExperiences,
  getExperienceById: getExperienceByIdController,
  getExperiencesByProfileId: getExperiencesByProfileIdController,
  createExperience: createExperienceController,
  updateExperience: updateExperienceController,
  deleteExperience: deleteExperienceController,
};
