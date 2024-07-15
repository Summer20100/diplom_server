const queriesChair = {
  createTableChair: 'CREATE TABLE IF NOT EXISTS "chair_types" (id SERIAL PRIMARY KEY, "type" VARCHAR(255) UNIQUE NOT NULL)',
  getChairsTypes: "SELECT * FROM chair_types",
  getChairsTypesById: "SELECT * FROM chair_types WHERE id = $1",
};
    
module.exports = {
  queriesChair,
};
    