const pool = require("../db");
const { queriesChair } = require("../queries/queriesChair");

const getChairsTypes = async (req, res) => {
  try {
    const result = await pool.query(queriesChair.getChairsTypes);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Chears types not created" });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getChairsTypesById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(queriesChair.getChairsTypesById, [id]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Chairs doesn\'t exist" });
    }
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
    getChairsTypes,
    getChairsTypesById
};
