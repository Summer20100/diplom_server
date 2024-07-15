const pool = require("../db");
const { queriesHall } = require("../queries/queriesHall");

const addHall = async (req, res) => {
  const { hall_title } = req.body;
  try {
    pool.query(queriesHall.checkIsHallExist, [hall_title], (err, result) => {
      if (result.rows.length) {
        return res.status(400).json({
          message: `${hall_title} already exists`,
        });
      }
      pool.query(queriesHall.addHall, [hall_title], (err, result) =>{
        if (err) {
          return res.status(400).json({
            message: "Hall not added",
          });
        }
      });
      return res.status(201).json({
        message: `${hall_title} created successfully`,
      });
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getHalls = async (req, res) => {
  try {
    const result = await pool.query(queriesHall.getHalls);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Halls not created" });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getHallById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(queriesHall.getHallById, [id]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Hall doesn\'t exist" });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeHall = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(queriesHall.getHallById, [id]);
    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Hall is not exists",
      })
    }
    await pool.query(queriesHall.removeHall, [id]);
    return res.status(200).json({ message: `Hall deleted successfully` });
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getHalls,
  getHallById,
  addHall,
  removeHall
};
