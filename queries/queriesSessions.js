const queriesSessions = {
  createTableSessions: `
    CREATE TABLE sessions (
      id SERIAL PRIMARY KEY,
      hall_id INT NOT NULL,
      hall_title VARCHAR(20) NOT NULL,
      session_date DATE NOT NULL,
      session_start TIME NOT NULL,
      session_finish TIME NOT NULL,
      film_id INT NULL
    );
  `,

  createSession: `
    INSERT INTO sessions (
      hall_id,
      hall_title,
      session_date,
      session_start,
      session_finish,
      film_id
    ) VALUES ($1, $2, $3, $4, $5, $6);
  `,

  getSessions: `
    SELECT * FROM sessions ORDER BY session_date, hall_id, session_start;
  `,

  getSessionById: `
    SELECT * FROM sessions WHERE id = $1
  `,

  getSessionByHallId: `
  SELECT * FROM sessions WHERE hall_id = $1 ORDER BY session_date, session_start;
  `,

  updateSession: `
    UPDATE sessions
    SET hall_id = $1,
        hall_title = $2,
        session_date = $3,
        session_start = $4,
        session_finish = $5,
        film_id = $6
    WHERE id = $7;
  `,

  deleteSession: `
    DELETE FROM sessions
    WHERE id = $1;
  `,
  
};

module.exports = {
  queriesSessions,
};
