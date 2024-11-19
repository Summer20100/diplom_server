const pool = require("../../db");
const { queriesChair } = require("../../queries/admin/queriesChair");
const { queriesHallChairs } = require("../../queries/admin/queriesHallChairs");

const getHallChairs = async (req, res) => {
  try {
    const result = await pool.query(queriesHallChairs.getHallChairs)
    return res.status(200).json(result.rows)
  } catch (err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const getHallChairsOfSession = async (req, res) => {
  try {
    const result = await pool.query(queriesHallChairs.getHallChairsOfSession)
    return res.status(200).json(result.rows)
  } catch (err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const getHallChairsByIdOfSession = async (req, res) => {
  try {
    const { id } = req.params;
    const result = (await pool.query(queriesHallChairs.getHallChairsByIdOfSession, [id, ])).rows;
    if (result.length === 0) {
      return res.status(404).json({ error: "Session does not exist"})
    }
    return res.status(200).json(result)
  } catch (err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const addHallChairsOfSession = async (req, res) => {
  const hallSeatsOfSession = req.body;
  try {
    if (!hallSeatsOfSession || hallSeatsOfSession.length === 0) {
      return res.status(400).json({ error: "No hall seats of session provided" });
    }
    for (const seat of hallSeatsOfSession) {
      const { id_seat, hall_id, hall_title, row_number, seat_number, chair_type, price, session_id } = seat;
      await pool.query(queriesHallChairs.addHallChairs, [
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
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const updateHallChairByIdSeatForBuying = async (req, res) => {
  const id  = parseInt(req.params.id);

  try {
    const id_seat = parseInt(req.query.seat);
    const check_is_buying = req.body.check_is_buying;

    const response = await pool.query(queriesHallChairs.updateHallChairByIdSeatForBuying, [id, id_seat, check_is_buying, ]);
    if (response.rowCount > 0) {
      console.log({ message: 'Buying status updated successfully'});
      return res.status(200).json({ message: `Buying status updated successfully`});
    } else {
      console.log({ message: 'Buying status not updated'});
      return res.status(404).json({ error: `Buying status not updated`});
    }
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const getHallChairsById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || isNaN(Number(id)) || id > Number.MAX_SAFE_INTEGER) {
      return res.status(400).json({ error: "Название зала или его номер введено некорректно" });
    };
    const result = (await pool.query(queriesHallChairs.getHallChairsById, [id, ])).rows;
    if (result.length === 0) {
      return res.status(404).json({ error: "Зала не существует"})
    };
    if (!result) {
      return res.status(500).json({ error: "Зал введён некорректно" });
    };
    return res.status(200).json(result)    
  } catch (err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const createTableHallChairs = async (req, res) => {
  try {
    await pool.query(queriesHallChairs.createTableHallChairs)
    return res.status(200).json({ message: "GOOODDD"})
  } catch(err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const addHallChairs = async (req, res) => {
  const hallSeats = req.body;
  const { hall_title, id_seat } = hallSeats[hallSeats.length -1];
  try {
    if (!hallSeats || hallSeats.length === 0) {
      return res.status(400).json({ error: "Нет кресел в зале" });
    }
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
    };

    console.log({ message: `Зал "${ hall_title }" в количестве ${ id_seat }мест сформирован успешно`})
    return res.status(200).json({ message: `Зал "${ hall_title }" в количестве ${ id_seat } мест сформирован успешно`})
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ошибка на сервере" });
  }
};

const updatePriceHallChairs = async (req, res) => {
  const id  = req.params.id;

  try {
    const id_seat = req.query.seat;
    const chair_type = req.body.chair_type;

    const type = req.query.type;
    const price = req.body.price;

    if (id_seat && chair_type) {
      await pool.query(queriesHallChairs.updateHallChairByIdSeat, [id, id_seat, chair_type,]);
      console.log({ message: `Тип места №${ id_seat } обновлён успешно`});
      return res.status(200).json({ message: `Тип места №${ id_seat } обновлён успешно`});
    };

    const hallSeats = await pool.query(
      queriesHallChairs.getHallChairsById, 
      [id, ]
    );

    if (hallSeats.rowCount === 0) {
      console.error(`Заполните данные конфигурации зала: количество рядов и мест в ряде`)
      return res.status(500).json({ error: `Заполните данные конфигурации зала: количество рядов и мест в ряде` });
    };

    if (hallSeats.rows.filter(el => el.chair_type === "disabled").length ===  hallSeats.rows.length ) {
      console.error(`Заполните данные типа кресел на схеме зала`)
      return res.status(500).json({ error: `Заполните данные типа кресел на схеме зала` });
    };

    if (price && type) {
      await pool.query(queriesHallChairs.updatePriceHallChairs, [price, type, id]);
      return res.status(200).json({ message: `Стоимость места обновлена успешно` });
    } else {
      console.error(`Стоимость места не обновлена`)
      return res.status(500).json({ error: `Стоимость места типа не обновлена` });
    };
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
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
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

module.exports = {
  getHallChairs,
  getHallChairsById,
  createTableHallChairs,
  addHallChairs,

  deleteHallChairs,
  updatePriceHallChairs,

  getHallChairsOfSession,
  getHallChairsByIdOfSession,
  addHallChairsOfSession,
  updateHallChairByIdSeatForBuying,

};
