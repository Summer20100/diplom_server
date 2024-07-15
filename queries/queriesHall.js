const queriesHall = {
  createTableHall: 'CREATE TABLE IF NOT EXISTS "halls" (id SERIAL PRIMARY KEY, hall_title VARCHAR(255) UNIQUE NOT NULL)',
  getHalls: "SELECT * FROM halls",
  getHallById: "SELECT * FROM halls WHERE id = $1",
  addHall: "INSERT INTO halls (hall_title) VALUES ($1)",
  checkIsHallExist: "SELECT * FROM halls WHERE hall_title = $1",
  removeHall: "DELETE FROM halls WHERE id = $1",
};

module.exports = {
  queriesHall,
};
