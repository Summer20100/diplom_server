const pool = require("../../db");
const { queriesChair } = require("../../queries/admin/queriesChair");

const sendResponse = (res, status, data) => {
  return res.status(status).json(data);
};

const handleError = (res, err, message = "Внутренняя ошибка сервера") => {
  console.error("Внутренняя ошибка сервера:", err);
  return sendResponse(res, 500, { error: message });
};

const getChairsTypes = async (req, res) => {
  try {
    const result = await pool.query(queriesChair.getChairsTypes);
    if (result.rows.length === 0) {
      return sendResponse(res, 400, { error: "Тип креслв не создан" });
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
      return sendResponse(res, 404, { error: "Тип кресла не найден" });
    }
    return sendResponse(res, 200, result.rows[0]);
  } catch (err) {
    return handleError(res, err);
  }
};

const createChairsTypesById = async (req, res) => {
  const { type } = req.body;
  try {
    const ifExist = await pool.query(queriesChair.getChairByType, [type, ]);
    if (ifExist.rows.length > 0) {
      return sendResponse(res, 401, { message: "Тип кресла уже существует" });
    }

    const result = await pool.query(queriesChair.createChairsType, [type]);
    return sendResponse(res, 201, {
      message: `Тип кресла "${type}" создан успешно`
    });
  } catch (err) {
    return handleError(res, err, "Ошибка при создании типа кресла");
  }
};

const deleteChairsTypeById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(queriesChair.deleteChairsTypeById, [id, ]);

    if (result.rowCount === 0) {
      return sendResponse(res, 404, { error: "Тип кресла не найден" });
    }

    return sendResponse(res, 200, { message: "Тип кресла удалён успешно" });
  } catch (err) {
    return handleError(res, err, "Ошибка при удалении кресла");
  }
};

module.exports = {
  createChairsTypesById,
  getChairsTypes,
  getChairsTypesById,
  deleteChairsTypeById
};
