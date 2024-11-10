const queriesUser = {
  createTableUser: `
    CREATE TABLE IF NOT EXISTS "user" (
      username VARCHAR(255) UNIQUE NOT NULL,
      "password" VARCHAR(255) NOT NULL
    );
    `,

  createUser: `
    INSERT INTO "user" (
      username,
      "password"
    ) VALUES ($1, $2);
    `,

  getUsers: `SELECT * FROM "user";`,

  getUserByUsername: `SELECT * FROM "user" WHERE username = $1;`,

  deleteUser: `DELETE FROM "user" WHERE username = $1;`,
}; 
    
module.exports = {
  queriesUser,
};   