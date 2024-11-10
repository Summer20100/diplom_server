const queriesAuth = {
  createTableRole: `
    CREATE TABLE IF NOT EXISTS "role" (
      "value" VARCHAR(255) UNIQUE NOT NULL DEFAULT 'USER'
    );
    `,

  createTableUser: `
    CREATE TABLE IF NOT EXISTS "user" (
      username VARCHAR(255) UNIQUE NOT NULL,
      "password" VARCHAR(255) NOT NULL
    );
    `,

  createTableUserRole: `
    CREATE TABLE IF NOT EXISTS user_role (
      username VARCHAR(255) REFERENCES "user"(username) ON DELETE CASCADE,
      "roles" VARCHAR(255) REFERENCES "role"("value") ON DELETE CASCADE,
      PRIMARY KEY (username, "roles")
    );
    `,

  getUsersRoles: `
    SELECT u.username, u.password, ARRAY_AGG(ur.roles) AS roles
    FROM "user" u
    LEFT JOIN user_role ur ON u.username = ur.username
    GROUP BY u.username, u.password;
  `,
}; 
    
module.exports = {
  queriesAuth,
};