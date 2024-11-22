const { json } = require("express");
const pool = require("../../db");
const { queriesFilms } = require("../../queries/admin/queriesFilms");

const createFilm = async (req, res) => {
  const { title, origin, release_date, poster_title, synopsis, image_url, duration, for_registration } = req.body;
  try {
    /* console.log({ title, origin, release_date, poster_title, synopsis, image_url, duration, for_registration })
 */
    if (!title) {
      console.log("Название фильма не может быть пустым")
      return res.status(401).json({ error: "Название фильма не может быть пустым", title: "title" });
    };
    if (!poster_title) {
      console.log("Постер к фильму не может быть пустым")
      return res.status(401).json({ error: "Постер к фильму не может быть пустым", title: "poster_title" });
    };
    if (!image_url) {
      console.log("URL постера к фильму не может быть пустым")
      return res.status(401).json({ error: "URL постера к фильму не может быть пустым", title: "image_url" });
    };
    if (!synopsis) {
      console.log("Описание фильма не может быть пустым")
      return res.status(401).json({ error: "Описание фильма не может быть пустым", title: "synopsis" });
    };
    if (!origin) {
      console.log("Страна создания не может быть пустым")
      return res.status(401).json({ error: "Постер к фильму не может быть пустым", title: "origin" });
    };
    if (!release_date) {
      console.log("Год создания фильма не может быть пустым")
      return res.status(401).json({ error: "Год создания фильма не может быть пустым", title: "release_date" });
    } else if (release_date < 1980) {
      console.log("Год создания фильма не может быть ранее 1980 года")
      return res.status(401).json({ error: "Год создания фильма не может быть ранее 1980 года", title: "release_date" });
    };
    if (!duration) {
      console.log("Длительность фильма не может быть пустым или нулевым");
      return res.status(401).json({ error: "Длительность фильма не может быть пустым", title: "duration" });
    } else if (duration >= 150) {
      console.log("Длительность фильма не может быть более 150 минут");
      return res.status(401).json({ error: "Длительность фильма не может быть более 150 минут", title: "duration" });
    };
    pool.query(queriesFilms.checkIsFilmExist, [title, ], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Ошибка при проверке наличия фильма в кинотеке",
        });
      };
      if (result.rows.length) {
        return res.status(400).json({
          error: `${title} уже существует`,
        });
      };
      pool.query(queriesFilms.createFilm, [
        title, 
        origin, 
        release_date, 
        poster_title, 
        synopsis, 
        image_url, 
        duration, 
        for_registration
      ], (err, result) => {
        if (err) {
          console.log("Фильм не добавлен в кинотеку");
          return res.status(400).json({
            error: "Фильм не добавлен в кинотеку",
          });
        }
      });
      console.log(`Фильм "${title}" успешно добавлен в кинотеку`);
      return res.status(200).json({
        message: `Фильм "${title}" успешно добавлен в кинотеку`,
      });
    })
  } catch(err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFilms = async (req, res) => {
  try {
    const result = await pool.query(queriesFilms.getFilms);
    const { rows: films } = result;
    return res.status(200).json(films);
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getFilmsById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(queriesFilms.getFilmById, [id, ]);
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateFilm = async (req, res) => {
  const { id } = req.params;

  try {
    const { title, origin, release_date, poster_title, synopsis, image_url, duration, for_registration } = req.body;

    const result = await pool.query(queriesFilms.getFilmById, [id, ]);
    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Такого фильма не существует",
      })
    };
    pool.query(queriesFilms.updateFilm, [
      title, 
      origin, 
      release_date, 
      poster_title, 
      synopsis, 
      image_url, 
      duration, 
      for_registration,
      id, 
    ], (err, result) => {
      if (err) {
        return res.status(400).json({
          error: "Данные фильма не обновлены",
        });
      }
    });

    if (!for_registration) {
      console.log(`На фильм "${title}" продажа билетов ЗАКРЫТА`);
      return res.status(200).json({ sale_status: `На фильм "${title}" продажа билетов ЗАКРЫТА`});
    };
    if (for_registration) {
      console.log(`На фильм "${title}" продажа билетов ОТКРЫТА`);
      return res.status(200).json({ sale_status: `На фильм "${title}" продажа билетов ОТКРЫТА`});
    };

    console.log(`Данные фильма "${title}" успешно обновлены`);
    return res.status(200).json({ message: `Данные фильма "${title}" успешно обновлены` });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Внутреняя ошибка сервера" });
  }
};

const removeFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(queriesFilms.getFilmById, [id, ]);
    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Такого фильма не существует",
      })
    }
    await pool.query(queriesFilms.deleteFilm, [id, ]);
    return res.status(200).json({ film: result.rows, message: `Фильм удалён успешно` });
  } catch (err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

module.exports = {
  getFilms,
  getFilmsById,
  createFilm,
  updateFilm,
  removeFilmById
};
