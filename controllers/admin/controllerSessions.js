const pool = require("../../db");
const { queriesSessions } = require("../../queries/admin/queriesSessions");
const { queriesFilms } = require("../../queries/admin/queriesFilms");
const { validationResult } = require("express-validator");

const getSessions = async (req, res) => {
  try {
    const result = await pool.query(queriesSessions.getSessions);
    const { rows: sessions } = result;
    return res.status(200).json(sessions);
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSessionsHalls = async (req, res) => {
  try {
    const result = await pool.query(queriesSessions.getSessions);

    const { rows: sessions } = result;

    const modifiedData = sessions.reduce((acc, session) => {
      const { hall_id, hall_title, session_date, id, session_start, session_finish, film_id } = session;
    
      if (!acc[hall_id]) {
        acc[hall_id] = {
          hall_id: Number(hall_id),
          hall_title,
          sessions: {}
        };
      }

      if (!acc[hall_id].sessions[session_date]) {
        acc[hall_id].sessions[session_date] = [];
      }

      acc[hall_id].sessions[session_date].push({
        id,
        session_start,
        session_finish,
        film_id
      });
    
      return acc;
    }, {});
    
    const finalData = Object.values(modifiedData).map(hallData => ({
      hall_id: hallData.hall_id,
      hall_title: hallData.hall_title,
      sessions: Object.entries(hallData.sessions).map(([session_date, session]) => ({
        session_date,
        session
      }))
    }));
    
    return res.status(200).json(finalData);
  } catch (err) {
    console.error("Error executing query", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(queriesSessions.getSessionById, [id, ]);
    if (result.length === 0) {
      return res.status(401).json({ error: "Session does not exist" });
    }
    console.log(`Session with ID ${id}:`, result.rows[0]);
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving session", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSessionsByDate = async (req, res) => {
  try {
    const result = await pool.query(queriesSessions.getSessions);
    const { rows: sessions } = result;
    const transformData = [];
    const groupByDate = sessions.reduce((acc, curr) => {
      if (!acc[curr.session_date]) {
          acc[curr.session_date] = {};
      }
      if (curr.film_id) {
          if (!acc[curr.session_date][curr.film_id]) {
              acc[curr.session_date][curr.film_id] = {};
          }
          if (!acc[curr.session_date][curr.film_id][curr.hall_id]) {
              acc[curr.session_date][curr.film_id][curr.hall_id] = {
                  hall_title: curr.hall_title,
                  sessions: []
              };
          }
          acc[curr.session_date][curr.film_id][curr.hall_id].sessions.push({
              id: curr.id,
              session_start: curr.session_start,
              session_finish: curr.session_finish,
          });
      }
      return acc;
    }, {});

    for (const session_date in groupByDate) {
      const films = [];
      for (const film_id in groupByDate[session_date]) {
          const halls = [];
          for (const hall_id in groupByDate[session_date][film_id]) {
              halls.push({
                hall_id: parseInt(hall_id),
                hall_title: groupByDate[session_date][film_id][hall_id].hall_title,
                sessions: groupByDate[session_date][film_id][hall_id].sessions
              });
          }
          films.push({
              film_id: parseInt(film_id),
              halls
          });
      }
      transformData.push({
          session_date,
          films
      });
    }
    return res.status(200).json(transformData);
  } catch (err) {
    console.error("Внутренняя ошибка сервера", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const getSessionByHallId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(queriesSessions.getSessionByHallId, [id]);
    const { rows: sessions } = result;

    const groupedByDate = sessions.reduce((acc, session) => {
      const { session_date, id, session_start, session_finish } = session;
      if (!acc[session_date]) {
        acc[session_date] = [];
      }
      acc[session_date].push({ id, session_start, session_finish });
      return acc;
    }, {});

    if (result.length === 0) {
      return res.status(401).json({ error: "Session does not exist" });
    }

    const modifiedData = sessions.reduce((acc, session) => {
      const { hall_id, hall_title, session_date, id, session_start, session_finish, film_id } = session;
    
      if (!acc[hall_id]) {
        acc[hall_id] = {
          hall_id: Number(hall_id),
          hall_title,
          sessions: {}
        };
      }

      if (!acc[hall_id].sessions[session_date]) {
        acc[hall_id].sessions[session_date] = [];
      }
    
      acc[hall_id].sessions[session_date].push({
        id,
        session_start,
        session_finish,
        film_id
      });
    
      return acc;
    }, {});
    
    const hallData = Object.values(modifiedData)[0]; 
    const finalData = {
      hall_id: hallData.hall_id,
      hall_title: hallData.hall_title,
      sessions: Object.entries(hallData.sessions).map(([session_date, session]) => ({
        session_date,
        session
      }))
    };

    return res.status(200).json(finalData);
  } catch (err) {
    console.error("Error retrieving session", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({message: "Ошибка при регистрации", error: errors.array()});
  };
  console.log(errors);
  try {
    const { hall_id, hall_title, session_date, session_start, session_finish, film_id } = req.body;

    console.log({hall_id, hall_title, session_date, session_start, session_finish, film_id})

    const resultSessions = await pool.query(queriesSessions.getSessions);
    const sessions = resultSessions.rows;
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    if (session_start >= session_finish) {
      console.log(`Начало сеанса в ${session_start} не может быть до онончания в ${session_finish}`);
      return res.status(401).json({
        error: `Начало сеанса в ${session_start} должно быть после онончания в ${session_finish}`,
      });
    }

    const neWdate = new Date(session_date);
    neWdate.setDate(neWdate.getDate() -1);

    const sessionsByHall = (await pool.query(queriesSessions.getSessionByHallId, [hall_id])).rows;
    const filterSessionsByDate = sessionsByHall.filter(session => formatDate(session.session_date) === formatDate(neWdate));

    if (!session_date) {
      console.log(`Дата сеанса не введена`);
        return res.status(500).json({ error: `Дата сеанса не введена` });
    };

    if (!session_start) {
      console.log(`Время начала сеанса не введено`);
        return res.status(500).json({ error: `Время начала сеанса не введено` });
    };

    if (!session_finish) {
      console.log(`Длительность сеанса не введена`);
        return res.status(500).json({ error: `Длительность сеанса не введена` });
    };

    for (const session of filterSessionsByDate) {
      const isOverlapping =
        (session_start < session.session_finish && session_finish > session.session_start) || // Пересечение
        (session_start >= session.session_start && session_start < session.session_finish) || // Новый начинается в рамках существующего
        (session_finish > session.session_start && session_finish <= session.session_finish) || // Новый заканчивается в рамках существующего
        (session_start <= session.session_start && session_finish >= session.session_finish); // Новый полностью охватывает существующий

      if (isOverlapping) {
        console.log(`Начало сеанса с ${session_start} до ${session_finish} перекрывается с существующим сеансом с ${session.session_start} до ${session.session_finish}`);
        return res.status(401).json({
          error: `Начало сеанса с ${session_start} по ${session_finish} перекрывается с существующим сеансом с ${session.session_start} до ${session.session_finish}`,
        });
      }
    };

    const result = await pool.query(
      queriesSessions.createSession,
      [
        hall_id,
        hall_title,
        session_date,
        session_start,
        session_finish,
        film_id
      ]
    );

    const sessionId = result.rows[0].id;
    console.log(`Сеанс создан успешно с ID: ${sessionId}`);
    return res.status(200).json({ message: `Сеанс создан успешно`, session_id: sessionId });
  } catch (err) {
    console.error("Внутренняя ошибка сервера:", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

const updateSession = async (req, res) => {
  try {
    const { hall_id, hall_title, session_date, session_start, session_finish, film_id } = req.body;
    const id = parseInt(req.params.id);

    const resultSession = await pool.query(queriesSessions.getSessionById, [id]);
    const session = resultSession.rows[0];


    if (!session) {
      return res.status(404).json({ error: "Сеанс не найден" });
    }
    
    function duration(start, finish) {
      const [startHour, startMinute] = start.split(":").map(Number);
      const [finishHour, finishMinute] = finish.split(":").map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const finishMinutes = finishHour * 60 + finishMinute;
      
      // Учет перехода через полночь
      return finishMinutes >= startMinutes 
        ? finishMinutes - startMinutes 
        : (1440 - startMinutes + finishMinutes);
    };

    const resultFilm = await pool.query(queriesFilms.getFilmById, [film_id]);
    const film = resultFilm.rows[0];

    const filmDuration = film ? film.duration : 0;
    const title = film ? film.title : "";
/*     if (!film) {
      return res.status(404).json({ message: "Фильм не найден" });
    } */

    const { session_start: start, session_finish: finish } = session;

    // console.log("session.session_date>>>", session.session_date)
    // console.log("session_date>>>", session_date)

    const date = new Date(session_date);

    function convertDate(dateString) {
      const [day, month, year] = dateString.split('.');
      const isoDate = `${year}-${month}-${String(Number(day)).padStart(2, '0')}T00:00:00.000Z`;
      return new Date(isoDate);
    };

    const formattedDate = convertDate(session_date);


    // console.log("session.session_date>>>", session.session_date);
    // console.log("session_date>>>", session_date);
    // console.log("formattedDate>>>", formattedDate);

    const sessionDuration = duration(session_start, session_finish);

    if (filmDuration > sessionDuration) {
      console.log(`Фильм не назначен. Длительность фильма (${filmDuration} мин.) больше длительности сеанса (${sessionDuration} мин.)`);
      return res.status(404).json({ error: `Фильм не назначен. Длительность фильма (${filmDuration} мин.) больше длительности сеанса (${sessionDuration} мин.)` });
    }

    const result = await pool.query(queriesSessions.updateSession, [
      hall_id,
      hall_title,
      formattedDate.toISOString(),
      session_start,
      session_finish,
      film_id,
      id,
    ]);

    if (result.rowCount > 0) {
      if (title === "" && filmDuration === 0) {
        console.log(`Фильм успешно снят с сеанса ${session_date} в ${session_start}`);
        return res.status(200).json({ message: `Фильм успешно снят с сеанса ${formattedDate} в ${session_start.slice(0, 5)}` });
      } else {
        console.log(`Фильм "${title}" успешно назначен на сеанс ${session_date} в ${session_start}`);
        return res.status(200).json({ message: `Фильм "${title}" успешно назначен на сеанс ${formattedDate} в ${session_start.slice(0, 5)}` });
      }
    } else {
      return res.status(500).json({ error: "Не удалось обновить сеанс" });
    }
  } catch (err) {
    console.error("Error updating session:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(queriesSessions.deleteSession, [id]);

    if (result.rowCount > 0) {
      console.log(`Сеанс успешно удалён`);
      return res
        .status(200)
        .json({ message: `Сеанс успешно удалён` });
    } else {
      console.log(`Такого сеанса не существует`);
      return res
        .status(404)
        .json({ error: `Сеанса с ID ${id} не существует` });
    }
  } catch (err) {
    console.error("Внутренняя ошибка сервера:", err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

module.exports = {
  getSessions,
  getSessionsHalls,
  getSessionByHallId,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getSessionsByDate
};
