const pool = require("../../db");
const { queriesUser } = require('../../queries/auth/queriesUser');

const sendResponse = (res, status, data) => {
  return res.status(status).json(data);
};

const handleError = (res, err, message = "Internal Server Error") => {
  console.error("Error executing query:", err);
  return sendResponse(res, 500, { error: message });
};

const createUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return sendResponse(res, 400, { error: "Username is required" });
  };

  if (!password) {
    return sendResponse(res, 400, { error: "Password is required" });
  };

  try {
    const ifExist = await pool.query(queriesUser.getUserByUsername, [username, ]);
    if (ifExist.rows.length > 0) {
      return sendResponse(res, 409, { message: "User almost exist" });
    };
    await pool.query(queriesUser.createUser, [username, password, ]);
    return sendResponse(res, 201, { message: `User ${ username } created successfully` });
  } catch (error) {
    return handleError(res, error, 'An error occurred while creating the user');
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await pool.query(queriesUser.getUsers);
    return sendResponse(res, 200, response.rows);
  } catch (err) {
    return handleError(res, err);
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const response = await pool.query(queriesUser.getUserByUsername, [username, ]);
    return sendResponse(res, 200, response.rows);
  } catch (err) {
    return handleError(res, err);
  }
};

const deleteUser = async (req, res) => {
  const { username } = req.params;

  if (!username || username.trim() === "") {
    return sendResponse(res, 400, { error: 'Username value for deleting is required' });
  };

  try {
    const ifExist = await pool.query(queriesUser.getUserByUsername, [username, ]);
    if (ifExist.rows.length > 0) {
      await pool.query(queriesUser.deleteUser, [username, ]);
      return sendResponse(res, 200, { message: `User ${username} deleted successfully` });
    } else {
      return sendResponse(res, 404, { message: "User not found" });
    }
  } catch (error) {
    return handleError(res, error, 'An error occurred while deleting the user');
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserByUsername,
  deleteUser
};
