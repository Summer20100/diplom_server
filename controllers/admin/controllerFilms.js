const { json } = require("express");
const pool = require("../../db");
const { queriesFilms } = require("../../queries/admin/queriesFilms");

const createFilm = async (req, res) => {
  const { title, origin, release_date, poster_title, synopsis, image_url, duration, for_registration } = req.body;
  try {
    pool.query(queriesFilms.checkIsFilmExist, [title, ], (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Error checking if film exists",
        });
      };
      if (result.rows.length) {
        return res.status(400).json({
          error: `${title} already exists`,
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
          return res.status(400).json({
            error: "Film not created",
          });
        }
      });
      return res.status(201).json({
        message: `${title} created successfully`,
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
        error: "Film is not exists",
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
          error: "Film not updated",
        });
      }
    });

    console.log({ message: 'Film updated successfully' });
    return res.status(200).json({ message: `Film updated successfully`});
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(queriesFilms.getFilmById, [id, ]);
    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "Film is not exists",
      })
    }
    await pool.query(queriesFilms.deleteFilm, [id, ]);
    return res.status(200).json({ film: result.rows, message: `Film deleted successfully` });
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

}

module.exports = {
  getFilms,
  getFilmsById,
  createFilm,
  updateFilm,
  removeFilmById
};
