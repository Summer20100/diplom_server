const pool = require("../../db");
const { queriesRole } = require('../../queries/auth/queriesRole');

const sendResponse = (res, status, data) => {
  return res.status(status).json(data);
};

const handleError = (res, err, message = "Internal Server Error") => {
  console.error("Error executing query:", err);
  return sendResponse(res, 500, { error: message });
};

const getRoles = async (req, res) => {
  try {
    const response = await pool.query(queriesRole.getRoles);
    return sendResponse(res, 200, response.rows);
  } catch (err) {
    return handleError(res, err);
  }
};

const createRole = async (req, res) => {
  const { value } = req.body;

  if (!value) {
    return sendResponse(res, 400, { error: "Role value is required" });
  }

  try {
    const ifExist = await pool.query(queriesRole.getRoleByValue, [value]);
    if (ifExist.rows.length > 0) {
      return sendResponse(res, 409, { message: "Role exists" });
    }

    await pool.query(queriesRole.createRole, [value]);
    return sendResponse(res, 201, { message: `Role ${value} created successfully` });
  } catch (error) {
    return handleError(res, error, 'An error occurred while creating the role');
  }
};

const deleteRole = async (req, res) => {
  const value = req.params.value;

  if (!value || value.trim() === "") {
    return sendResponse(res, 400, { error: 'Role value for deleting is required' });
  };

  try {
    const ifExist = await pool.query(queriesRole.getRoleByValue, [value]);
    if (ifExist.rows.length > 0) {
      await pool.query(queriesRole.deleteRole, [value]);
      return sendResponse(res, 200, { message: `Role ${value} deleted successfully` });
    } else {
      return sendResponse(res, 404, { message: "Role not found" });
    }
  } catch (error) {
    return handleError(res, error, 'An error occurred while deleting the role');
  }
};

module.exports = {
  createRole,
  getRoles,
  deleteRole
};
