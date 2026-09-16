const {
  getAllEducation,
  getEducationById,
  getEducationByProfileId,
  createEducation,
  updateEducation,
  deleteEducation,
} = require("../models/educationModel");

// Get all education records
const getEducation = async (req, res) => {
  try {
    const education = await getAllEducation();

    res.json(education);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting education",
    });
  }
};

// Get education by ID
const getEducationByIdController = async (req, res) => {
  try {
    const education = await getEducationById(req.params.id);

    if (!education) {
      return res.status(404).json({
        message: "Education not found",
      });
    }

    res.json(education);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting education",
    });
  }
};

// Get education by profile ID
const getEducationByProfileIdController = async (req, res) => {
  try {
    const education = await getEducationByProfileId(req.params.profileId);

    res.json(education);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting profile education",
    });
  }
};

// Create education
const createEducationController = async (req, res) => {
  try {
    const {
      profileId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    } = req.body;

    const education = await createEducation(
      profileId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    );

    res.status(201).json(education);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating education",
    });
  }
};

// Update education
const updateEducationController = async (req, res) => {
  try {
    const {
      profileId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    } = req.body;

    const education = await updateEducation(
      req.params.id,
      profileId,
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      description,
    );

    if (!education) {
      return res.status(404).json({
        message: "Education not found",
      });
    }

    res.json(education);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating education",
    });
  }
};

// Delete education
const deleteEducationController = async (req, res) => {
  try {
    const education = await deleteEducation(req.params.id);

    if (!education) {
      return res.status(404).json({
        message: "Education not found",
      });
    }

    res.json({
      message: "Education deleted successfully",
      education,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting education",
    });
  }
};

module.exports = {
  getEducation,
  getEducationById: getEducationByIdController,
  getEducationByProfileId: getEducationByProfileIdController,
  createEducation: createEducationController,
  updateEducation: updateEducationController,
  deleteEducation: deleteEducationController,
};
