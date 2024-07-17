const pool = require("../db");
const { queriesHallChairs } = require("../queries/queriesHallChairs");

const getHallChairs = async (req, res) => {
  try {
    const seat = req.body

    console.log(seat);
    return res.status(200).json(seat)
    // return res.status(200).json({ message: "GOOODDD"})
    
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
    createTableHallChairs,
    addHallChairs
};
