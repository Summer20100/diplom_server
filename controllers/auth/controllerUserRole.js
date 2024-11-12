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
    return sendResponse(res, 200, response.rows[0].roles);
  } catch (err) {
    return handleError(res, err);
  }
};

const addRoleToUser = async (req, res) => {
  const { username } = req.params
  const { role} = req.body
  try {
    const userExist = await pool.query(queriesUserRole.getUserRolesByUsername, [username, ]);
    if (userExist.rowCount === 0) {
      return sendResponse(res, 404, { error: 'User not found' });
    };
    await pool.query(queriesUserRole.addRoleToUser, [username, role,]);
    sendResponse(res, 200, { message: 'Role added to user successfully' });
  } catch (err) {
    return handleError(res, err, {error: 'Role is exist'});
  }
};

const correctRoleByUser = async (req, res) => {
  const { username } = req.params
  const { role} = req.body
  try {
    const userExist = await pool.query(queriesUserRole.getUserRolesByUsername, [username, ]);
    if (userExist.rowCount === 0) {
      return sendResponse(res, 404, { error: 'User not found' });
    };
    const userRole = userExist.rows[0].roles.find(el => el === role);
    if (!userRole) {
      return sendResponse(res, 404, {error: 'Role for user is not exist'});
    };
    await pool.query(queriesUserRole.correctRoleByUser, [username, role,]);
    sendResponse(res, 200, { message: 'Role delete successfully' });
  } catch (err) {
    return handleError(res, err, {error: 'Role is exist'});
  }
};

module.exports = {
  getUserRoles,
  getUserRolesByUsername,
  addRoleToUser,
  correctRoleByUser
};
