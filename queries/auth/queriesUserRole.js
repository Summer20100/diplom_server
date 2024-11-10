const queriesUserRole = {
  createTableUserRole: `
    CREATE TABLE IF NOT EXISTS user_role (
      username VARCHAR(255) REFERENCES "user"(username) ON DELETE CASCADE,
      "roles" VARCHAR(255) REFERENCES "role"("value") ON DELETE CASCADE,
      PRIMARY KEY (username, "roles")
    );
  `,

  createUserRole: `
    INSERT INTO user_role (
      username, 
      "roles"
    ) VALUES ($1, $2)
    ON CONFLICT (username, "roles") DO NOTHING; 
  `,

  getUserRoles: `
    SELECT * FROM user_role;
  `,

  // getUserRolesByUsername: `
  //   SELECT "roles" FROM user_role WHERE username = $1;
  // `,

  getUserRolesByUsername: `
    SELECT array_agg("roles") AS roles
    FROM user_role
    WHERE username = $1
    GROUP BY username;
  `,
};

module.exports = {
  queriesUserRole,
};
