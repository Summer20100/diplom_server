const pool = require("../db");
const { queriesChair } = require("../queries/queriesChair");
const { queriesHallChairs } = require("../queries/queriesHallChairs");

const getHallChairs = async (req, res) => {
  try {
    const result = await pool.query(queriesHallChairs.getHallChairs)
    return res.status(200).json(result.rows)
    // return res.status(200).json({ message: "GOOODDD"})
    
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getHallChairsById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = (await pool.query(queriesHallChairs.getHallChairsById, [id,])).rows;
    if (result.length === 0) {
      return res.status(401).json({ message: "Hall does not exist"})
    }
    return res.status(200).json(result)    
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createTableHallChairs = async (req, res) => {
  try {
    pool.query(queriesHallChairs.createTableHallChairs)
    return res.status(200).json({ message: "GOOODDD"})
  } catch(err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const addHallChairs = async (req, res) => {
  const hallSeats = req.body;
  
  try {
    for (const seat of hallSeats) {
      const { id_seat, hall_id, hall_title, row_number, seat_number, chair_type, price } = seat;
      
      await pool.query(queriesHallChairs.addHallChairs, [
        id_seat,
        hall_id,
        hall_title,
        row_number,
        seat_number,
        chair_type,
        price
      ]);
    }
    
    return res.status(200).json({ message: 'Seats added successfully'})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
    getHallChairs,
    getHallChairsById,
    createTableHallChairs,
    addHallChairs
};
