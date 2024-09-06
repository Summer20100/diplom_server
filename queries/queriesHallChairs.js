const queriesHallChairs = {
  createTableHallChairs: `
    CREATE TABLE IF NOT EXISTS hall_chairs (
      id_seat INT NOT NULL,
      hall_id INT NOT NULL,
      hall_title VARCHAR(50) NOT NULL,
      row_number INT NOT NULL,
      seat_number INT NOT NULL,
      chair_type VARCHAR(50) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
  );`,

  getHallChairs: "SELECT * FROM hall_chairs;",

  getHallChairsById: "SELECT * FROM hall_chairs WHERE hall_id = $1;",

  addHallChairs: `
    INSERT INTO hall_chairs (
      id_seat,
      hall_id,
      hall_title,
      row_number,
      seat_number,
      chair_type,
      price
    ) VALUES ($1, $2, $3, $4, $5, $6, $7);
    `,
  
  updateHallChairByIdSeat: `
    UPDATE hall_chairs 
      SET chair_type = $3 
        WHERE hall_id = $1 
        AND id_seat = $2;
    `,
  
  // updateHallChairByIdSeat: "SELECT * FROM hall_chairs WHERE hall_id = $1 AND id_seat = $2;",

  deleteHallChairs: "DELETE FROM hall_chairs WHERE hall_id = $1;",

  updatePriceHallCairs: `
    UPDATE hall_chairs 
      SET price = $1
        WHERE chair_type = $2
        AND hall_id = $3;
    `,
};

module.exports = {
  queriesHallChairs,
};