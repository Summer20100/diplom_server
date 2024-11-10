const queriesRole = {
  createTableRole: `
    CREATE TABLE IF NOT EXISTS "role" (
      "value" VARCHAR(255) UNIQUE NOT NULL DEFAULT 'USER'
    );
    `,

  getRoles: `
    SELECT * from "role";
    `,

  getRoleByValue: `
    SELECT * from "role" WHERE "value" = $1;
    `,

  createRole: `
    INSERT INTO "role" (
      "value"
    ) VALUES ($1);
  `,

  deleteRole: `DELETE FROM "role" WHERE "value" = $1;`,
}; 
    
module.exports = {
  queriesRole
};
