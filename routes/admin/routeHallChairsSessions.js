const { Router } = require("express");

const controllerHallChairsSessions = require("../../controllers/admin/controllerHallChairsSessions");

const router = Router();

router.get("/", controllerHallChairsSessions.getHallChairsOfSession);
router.get("/:id", controllerHallChairsSessions.getHallChairsByIdOfSession);
router.post("/", controllerHallChairsSessions.addHallChairsOfSession);
router.put("/:id", controllerHallChairsSessions.updateHallChairByIdSeatForBuying);


module.exports = router;
