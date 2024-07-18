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

  getHallChairs: "SELECT * FROM hall_chairs",

  getHallChairsById: "SELECT * FROM hall_chairs WHERE hall_id = $1",

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

    deleteHallChairs: "DELETE FROM hall_chairs WHERE hall_id = $1 ",
};

module.exports = {
  queriesHallChairs,
};