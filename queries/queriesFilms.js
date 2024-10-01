const queriesFilms = {
    createTableFilms: `
      CREATE TABLE IF NOT EXISTS films (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        origin VARCHAR(100) NOT NULL,
        release_date INT NOT NULL,
        poster_title VARCHAR(255) NOT NULL,
        synopsis TEXT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        duration INT NOT NULL,
        session_id INT NULL
      );
    `,
  
    createFilm: `
      INSERT INTO films (
        title,
        origin,
        release_date,
        poster_title,
        synopsis,
        image_url,
        duration,
        session_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NULL);
    `,
  
    getFilmById: `
      SELECT * FROM films WHERE id = $1 ORDER BY title;
    `,
  
    updateFilm: `
      UPDATE films
      SET title = $1,
          origin = $2,
          release_date = $3,
          poster_title = $4,
          synopsis = $5,
          image_url = $6,
          duration = $7,
          session_id = $8
      WHERE id = $9;
    `,
  
    deleteFilm: `
      DELETE FROM films WHERE id = $1;
    `
};
  
module.exports = {
    queriesFilms,
};
  