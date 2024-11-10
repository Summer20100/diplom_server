const queriesChair = {
  createTableChair: `
    CREATE TABLE IF NOT EXISTS "chair_types" (
      id SERIAL PRIMARY KEY, 
      "type" VARCHAR(255) UNIQUE NOT NULL
    );
  `,

  createChairsType: `
    INSERT INTO chair_types (
      type
    ) VALUES ($1);
  `,

  getChairsTypes: 'SELECT * FROM chair_types;',
  getChairByType: 'SELECT * FROM chair_types WHERE type = $1;',
  getChairsTypesById: 'SELECT * FROM chair_types WHERE id = $1;',
  deleteChairsTypeById: 'DELETE FROM chair_types WHERE id = $1;',
}; 
    
module.exports = {
  queriesChair,
};
    