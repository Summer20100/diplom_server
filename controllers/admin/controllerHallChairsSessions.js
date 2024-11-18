const pool = require("../../db");
const { queriesHallChairsSessions } = require("../../queries/admin/queriesHallChairsSessions");

const getHallChairsOfSession = async (req, res) => {
  try {
    const result = await pool.query(queriesHallChairsSessions.getHallChairsOfSession)
    return res.status(200).json(result.rows)
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getHallChairsByIdOfSession = async (req, res) => {
  try {
    const { id } = req.params;
    const result = (await pool.query(queriesHallChairsSessions.getHallChairsByIdOfSession, [id, ])).rows;
    if (result.length === 0) {
      return res.status(404).json({ error: "Данной сессии не существует"})
    };
    return res.status(200).json(result)
  } catch (err) {
    console.error("Внуртенняя ошибка сервера", err);
    return res.status(500).json({ error: "Внуртенняя ошибка сервера" });
  }
};

const addHallChairsOfSession = async (req, res) => {
  const hallSeatsOfSession = req.body;
  const { session_id } = hallSeatsOfSession[0];
  
  try {
    if (!hallSeatsOfSession || hallSeatsOfSession.length === 0) {
      return res.status(400).json({ error: "No hall seats of session provided" });
    }

    const sessionIsExist = (await pool.query(queriesHallChairsSessions.getHallChairsByIdOfSession, [session_id, ])).rows;
    if (sessionIsExist.length > 0) {
      return res.status(401).json({ error: "Hall seats of session existed" });
    } 

    for (const seat of hallSeatsOfSession) {
      const { id_seat, hall_id, hall_title, row_number, seat_number, chair_type, price, session_id } = seat;
      await pool.query(queriesHallChairsSessions.addHallChairsOfSession, [
        id_seat,
        hall_id,
        hall_title,
        row_number,
        seat_number,
        chair_type,
        price,
        session_id
      ]);
    }
    console.log({ message: 'Hall seats of session added successfully'})
    return res.status(200).json({ message: 'Hall seats of session added successfully'})
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateHallChairByIdSeatForBuying = async (req, res) => {
  const id  = parseInt(req.params.id);

  try {
    const id_seat = parseInt(req.body.id_seat);
    const check_is_buying = req.body.check_is_buying;

    if (isNaN(id) || isNaN(id_seat) || typeof check_is_buying !== 'boolean') {
      return res.status(400).json({ error: "Invalid input data" });
    };

    const response = await pool.query(queriesHallChairsSessions.updateHallChairByIdSeatForBuying, [id, id_seat, check_is_buying, ]);

    if (response.rowCount > 0) {
      console.log({ message: 'Buying status updated successfully'});
      return res.status(200).json({ message: `Buying status updated successfully`});
    } else {
      console.log({ message: 'Buying status not updated'});
      return res.status(404).json({ error: `Buying status not updated`});
    }
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getHallChairsOfSession,
  getHallChairsByIdOfSession,
  addHallChairsOfSession,
  updateHallChairByIdSeatForBuying,
};
