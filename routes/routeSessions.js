const { Router } = require("express");

const controllerSessions = require("../controllers/controllerSessions");

const router = Router();

router.get("/", controllerSessions.getSessions);
router.get("/halls", controllerSessions.getSessionsHalls);
router.get("/date", controllerSessions.getSessionsByDate);
router.post("/", controllerSessions.createSession);
router.get("/:id", controllerSessions.getSessionById);
router.get("/hall/:id", controllerSessions.getSessionByHallId);
router.put("/:id", controllerSessions.updateSession);
router.delete("/:id", controllerSessions.deleteSession);

module.exports = router;
