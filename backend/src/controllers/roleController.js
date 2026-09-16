const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require("../models/roleModel");

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await getAllRoles();

    res.json(roles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting roles",
    });
  }
};

// Get role by ID
const getRoleByIdController = async (req, res) => {
  try {
    const role = await getRoleById(req.params.id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    res.json(role);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error getting role",
    });
  }
};

// Create role
const createRoleController = async (req, res) => {
  try {
    const { roleName } = req.body;

    const role = await createRole(roleName);

    res.status(201).json(role);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating role",
    });
  }
};

// Update role
const updateRoleController = async (req, res) => {
  try {
    const { roleName } = req.body;

    const role = await updateRole(req.params.id, roleName);

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    res.json(role);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating role",
    });
  }
};

// Delete role
const deleteRoleController = async (req, res) => {
  try {
    const role = await deleteRole(req.params.id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    res.json({
      message: "Role deleted successfully",
      role,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting role",
    });
  }
};

module.exports = {
  getRoles,
  getRoleById: getRoleByIdController,
  createRole: createRoleController,
  updateRole: updateRoleController,
  deleteRole: deleteRoleController,
};
