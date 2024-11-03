const queriesHallChairsSessions = {
  createTableHallChairsOfSession: `
    CREATE TABLE IF NOT EXISTS hall_chairs_of_session (
      id_seat INT NOT NULL,
      hall_id INT NOT NULL,
      hall_title VARCHAR(50) NOT NULL,
      row_number INT NOT NULL,
      seat_number INT NOT NULL,
      chair_type VARCHAR(50) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      session_id INT NOT NULL,
      check_is_buying BOOLEAN DEFAULT false
    );`,

  getHallChairsOfSession: "SELECT * FROM hall_chairs_of_session ORDER BY session_id, id_seat;",

  getHallChairsByIdOfSession: "SELECT * FROM hall_chairs_of_session WHERE session_id = $1 ORDER BY id_seat;",

  addHallChairsOfSession: `
    INSERT INTO hall_chairs_of_session (
      id_seat,
      hall_id,
      hall_title,
      row_number,
      seat_number,
      chair_type,
      price,
      session_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `,

  updateHallChairByIdSeatForBuying: `
    UPDATE hall_chairs_of_session 
      SET check_is_buying = $3 
        WHERE session_id = $1 
        AND id_seat = $2;
    `,

  deleteHallChairsOfSession: "DELETE FROM hall_chairs_of_session WHERE session_id = $1;",

};

module.exports = {
  queriesHallChairsSessions,
};
