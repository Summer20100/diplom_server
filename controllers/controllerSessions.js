const pool = require("../db");
const { queriesSessions } = require("../queries/queriesSessions");

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
    
    // Convert to array format
    const finalData = Object.values(modifiedData).map(hallData => ({
      hall_id: hallData.hall_id,
      hall_title: hallData.hall_title,
      sessions: Object.entries(hallData.sessions).map(([session_date, session]) => ({
        session_date,
        session
      }))
    }));
    
    console.log(finalData);

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
      return res.status(401).json({ message: "Session does not exist" });
    }
    console.log(`Session with ID ${id}:`, result.rows[0]);
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving session", err);
    return res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(401).json({ message: "Session does not exist" });
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
      
    // return res.status(200).json(groupedByDate);
    // return res.status(200).json(result.rows);
    return res.status(200).json(finalData);
  } catch (err) {
    console.error("Error retrieving session", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createSession = async (req, res) => {
  const { hall_id, hall_title, session_date, session_start, session_finish, film_id } =
    req.body;
  try {
    if (session_start >= session_finish) {
      console.log(
        `Session start ${session_start} is not before finish ${session_finish}`,
      );
      return res
        .status(400)
        .json({
          error: `Session start ${session_start} must be before finish ${session_finish}`,
        });
    }

    const sessionsByHall = (
      await pool.query(queriesSessions.getSessionByHallId, [hall_id])
    ).rows;

    let minSessionStart = null;
    let maxSessionFinish = null;

    if (sessionsByHall.length > 0) {
      minSessionStart = sessionsByHall.reduce((min, session) => {
        return min < session.session_start ? min : session.session_start;
      }, sessionsByHall[0].session_start);

      maxSessionFinish = sessionsByHall.reduce((max, session) => {
        return max > session.session_finish ? max : session.session_finish;
      }, sessionsByHall[0].session_finish);
    }

    // if (minSessionStart !== null && maxSessionFinish !== null) {
    //   if (
    //     (session_start >= minSessionStart && session_start < maxSessionFinish) ||
    //     (session_finish > minSessionStart && session_finish <= maxSessionFinish) ||
    //     (session_start <= minSessionStart && session_finish >= maxSessionFinish)
    //   ) {
    //     console.log(`New session times overlap with existing sessions: minSessionStart ${minSessionStart}, maxSessionFinish ${maxSessionFinish}`);
    //     return res.status(400).json({
    //       error: `New session time overlaps with existing sessions: minSessionStart ${minSessionStart}, maxSessionFinish ${maxSessionFinish}`
    //     });
    //   }
    // };

    await pool.query(queriesSessions.createSession, [
      hall_id,
      hall_title,
      session_date,
      session_start,
      session_finish,
      film_id
    ], (err, result) => {
      if (err) {
        return res.status(400).json({
          message: "Film not created",
        });
      }
    });

    console.log(`Session was created`);
    return res.status(200).json({ message: `Session was created` });
  } catch (err) {
    console.error("Error creating session:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSession = async (req, res) => {
  const { hall_id, hall_title, session_date, session_start, session_finish, film_id } =
    req.body;
  const { id } = parseInt(req.params);
  try {
    const result = await pool.query(queriesSessions.updateSession, [
      hall_id,
      hall_title,
      session_date,
      session_start,
      session_finish,
      film_id,
      id,
    ]);

    if (result.rowCount > 0) {
      console.log(`Session with ID ${id} updated successfully.`);
      return res
        .status(200)
        .json({ message: `Session with ID ${id} updated successfully.` });
    } else {
      console.log(`No session found with ID ${id}.`);
      return res.status(404).json({ error: `No session found with ID ${id}.` });
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
      console.log(`Session with ID ${id} deleted successfully.`);
      return res
        .status(200)
        .json({ message: `Session with ID ${id} deleted successfully` });
    } else {
      console.log(`Session with ID ${id} does not exist`);
      return res
        .status(404)
        .json({ error: `Session with ID ${id} does not exist` });
    }
  } catch (err) {
    console.error("Error deleting session:", err);
    return res.status(500).json({ error: "Internal Server Error" });
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
};
