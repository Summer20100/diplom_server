const pool = require("../../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } =require("express-validator");

const { queriesAuth } = require("../../queries/auth/queriesAuth");
const { queriesRole } = require("../../queries/auth/queriesRole");
const { queriesUser } = require("../../queries/auth/queriesUser");
const { queriesUserRole } = require("../../queries/auth/queriesUserRole");
const { secret } = require("../../config");

const generateAcsessToken = (username, roles) => {
  const payload = {
    username,
    roles
  };
  return jwt.sign(payload, secret, {expiresIn: "24h"})
};

const sendResponse = (res, status, data) => {
  return res.status(status).json(data);
};

const handleError = (res, err, message = "Internal Server Error") => {
  console.error("Error executing query:", err);
  return sendResponse(res, 500, { error: message });
};

const registration = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, {message: "Ошибка при регистрации", error: errors.array()});
  };
  try {
    const { username, password } = req.body;

    if (!username && !password) {
      return sendResponse(res, 400, { error: "Username and password are required" });
    } else if (!username) {
      return sendResponse(res, 400, { error: "Username is required" });
    } else if (!password) {
      return sendResponse(res, 400, { error: "Password is required" });
    };    

    const ifExist = await pool.query(queriesUser.getUserByUsername, [username]);
    if (ifExist.rows.length > 0) {
      return sendResponse(res, 409, { message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const currentRole = "USER";
    const roleUser = await pool.query(queriesRole.getRoleByValue, [currentRole]);
    if (roleUser.rows.length > 0) {
      await pool.query(queriesUser.createUser, [username, hashPassword]);
      await pool.query(queriesUserRole.createUserRole, [username, currentRole]);
    } else {
      return sendResponse(res, 400, { message: "Role not found" });
    }

    return sendResponse(res, 201, { message: "Registration successful" });
  } catch (err) {
    return handleError(res, err, "Registration error");
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const ifExist = await pool.query(queriesUser.getUserByUsername, [username, ]);

    if (ifExist.rows.length === 0) {
      return sendResponse(res, 401, { message: `User ${ username } not found` });
    };
    
    const rolesByUser = await pool.query(queriesUserRole.getUserRolesByUsername, [username, ]);
    if (rolesByUser.rows.length === 0) {
      return sendResponse(res, 400, { message: `Нет ролей для пользователя ${username}` });
    };
    const { roles } = rolesByUser.rows[0];
    const token = generateAcsessToken(username, roles);

    const validPass = bcrypt.compareSync(password, ifExist.rows[0].password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: validPass ? 3600 * 1000 : 0
    });
    if (!validPass) {
      return sendResponse(res, 400, { message: `Неверный пароль` });
    };

    return sendResponse(res, 200, {message: `User "${username}" logged in successfully`, token});
  } catch (err) {
    return handleError(res, err, {message: "Login error"});
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(queriesAuth.getUsersRoles);    
    return sendResponse(res, 200, result.rows);
  } catch (err) {
    return handleError(res, err, "Failed to get users");
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(queriesAuth.getUserRolesByUsername, [username, ]);    
    return sendResponse(res, 200, result.rows);
  } catch (err) {
    return handleError(res, err, "Failed to get user by name");
  }
};

module.exports = {
  registration,
  login,
  getUsers,
  getUserByUsername
};
