const { Router } = require("express");
const { check } = require("express-validator");

const controllerSessions = require("../../controllers/admin/controllerSessions");

const router = Router();

router.get("/", controllerSessions.getSessions);
router.get("/halls", controllerSessions.getSessionsHalls);
router.get("/date", controllerSessions.getSessionsByDate);
router.post("/", [
    check("session_date", "Необходимо выбрать дату сеанса").notEmpty(),
    check("session_start", "Необходимо указать начало сеанса в формате ЧЧ:ММ").notEmpty(),
    check("session_finish", "Необходимо указать длительность сеанса (минимальная 1 мин., максимальная 149 минут)").notEmpty(),
], controllerSessions.createSession);
router.get("/:id", controllerSessions.getSessionById);
router.get("/hall/:id", controllerSessions.getSessionByHallId);
router.put("/:id", controllerSessions.updateSession);
router.delete("/:id", controllerSessions.deleteSession);

module.exports = router;
