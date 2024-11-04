const pool = require("../db");
const { queriesChair } = require("../queries/queriesChair");

const sendResponse = (res, status, data) => {
  return res.status(status).json(data);
};

const handleError = (res, err, message = "Internal Server Error") => {
  console.error("Error executing query:", err);
  return sendResponse(res, 500, { error: message });
};

const getChairsTypes = async (req, res) => {
  try {
    const result = await pool.query(queriesChair.getChairsTypes);
    if (result.rows.length === 0) {
      return sendResponse(res, 400, { error: "Chair types not created" });
    }
    return sendResponse(res, 200, result.rows);
  } catch (err) {
    return handleError(res, err);
  }
};

const getChairsTypesById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(queriesChair.getChairsTypesById, [id]);
    if (result.rows.length === 0) {
      return sendResponse(res, 404, { error: "Chair not found" });
    }
    return sendResponse(res, 200, result.rows);
  } catch (err) {
    return handleError(res, err);
  }
};

module.exports = {
  getChairsTypes,
  getChairsTypesById
};
