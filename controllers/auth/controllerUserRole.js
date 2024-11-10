const pool = require("../../db");
const { queriesUserRole } = require('../../queries/auth/queriesUserRole');

const sendResponse = (res, status, data) => {
  return res.status(status).json(data);
};

const handleError = (res, err, message = "Internal Server Error") => {
  console.error("Error executing query:", err);
  return sendResponse(res, 500, { error: message });
};

const getUserRoles = async (req, res) => {
  try {
    const response = await pool.query(queriesUserRole.getUserRoles);
    return sendResponse(res, 200, response.rows);
  } catch (err) {
    return handleError(res, err);
  }
};

const getUserRolesByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    
    const response = await pool.query(queriesUserRole.getUserRolesByUsername, [username, ]);
    return sendResponse(res, 200, response.rows[0].result);
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = {
  getUserRoles,
  getUserRolesByUsername
};
