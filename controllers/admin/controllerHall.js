const pool = require("../../db");
const { queriesHall } = require("../../queries/admin/queriesHall");

const addHall = async (req, res) => {
  const { hall_title } = req.body;
  if (!hall_title || hall_title === null) {
    console.log("Введите название зала");
    return res.status(400).json({ error: "Введите название зала" });
  }
  try {
    const result = await pool.query(queriesHall.checkIsHallExist, [hall_title]);
    
    if (result.rows.length) {
      return res.status(400).json({
        error: `${hall_title} уже существует`,
      });
    };
    await pool.query(queriesHall.addHall, [hall_title]);
;
    return res.status(201).json({
      message: `${hall_title} успешно создан`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};


const getHalls = async (req, res) => {
  try {
    const result = await pool.query(queriesHall.getHalls);
    if (!result.rows) {
      return res.status(401).json([]);
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const getHallById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(queriesHall.getHallById, [id]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Зал не существует" });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const removeHall = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(queriesHall.getHallById, [id]);
    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Зал не существует",
      })
    }
    await pool.query(queriesHall.removeHall, [id]);
    return res.status(200).json({ hall: result.rows, message: `Зал удалён успешно` });
  } catch (err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

module.exports = {
  getHalls,
  getHallById,
  addHall,
  removeHall
};
