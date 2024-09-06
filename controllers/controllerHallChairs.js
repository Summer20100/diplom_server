const pool = require("../db");
const { queriesChair } = require("../queries/queriesChair");
const { queriesHallChairs } = require("../queries/queriesHallChairs");

const getHallChairs = async (req, res) => {
  try {
    const result = await pool.query(queriesHallChairs.getHallChairs)
    return res.status(200).json(result.rows)
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
    await pool.query(queriesHallChairs.createTableHallChairs)
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
    console.log({ message: 'Hall seats added successfully'})
    return res.status(200).json({ message: 'Hall seats added successfully'})
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// const updateHallChairByIdSeat = async (req, res) => {
//   const hall_id = req.params.id;
//   const id_seat = req.query.seat;
//   const chair_type = req.body.type_seat;

//   try {
//     await pool.query(queriesHallChairs.updateHallChairByIdSeat, [hall_id, id_seat, chair_type,]);
//     console.log({ message: 'Type of chair updated successfully'});
//     return res.status(200).json({ message: `Type of chair updated successfully`});
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const updatePriceHallCairs = async (req, res) => {
  const id  = req.params.id;

  try {
    const id_seat = req.query.seat;
    const chair_type = req.body.chair_type;

    const type = req.query.type;
    const price = req.body.price;

    if (id_seat && chair_type) {
      await pool.query(queriesHallChairs.updateHallChairByIdSeat, [id, id_seat, chair_type,]);
      console.log({ message: 'Type of chair updated successfully'});
      return res.status(200).json({ message: `Type of chair updated successfully`});
    }

    await pool.query(queriesHallChairs.updatePriceHallCairs, [price, type, id,]);
    console.log({ message: 'Price updated successfully'});
    return res.status(200).json({ message: `Price updated successfully`});
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteHallChairs = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(queriesHallChairs.deleteHallChairs, [id,]);
    console.log({ message: 'Hall seats deleted successfully'})
    return res.status(200).json({ message: `Hall seats deleted successfully`})
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
    getHallChairs,
    getHallChairsById,
    createTableHallChairs,
    addHallChairs,
    // updateHallChairByIdSeat,
    deleteHallChairs,
    updatePriceHallCairs
};
