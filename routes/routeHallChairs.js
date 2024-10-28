const { Router } = require("express");

const controllerHallChairs = require("../controllers/controllerHallChairs");

const router = Router();

router.get("/", controllerHallChairs.getHallChairs);

router.get("/:id", controllerHallChairs.getHallChairsById);

router.get("/create", controllerHallChairs.createTableHallChairs);
router.post("/", controllerHallChairs.addHallChairs);

router.put("/:id", controllerHallChairs.updatePriceHallChairs);
router.delete("/:id", controllerHallChairs.deleteHallChairs);


module.exports = router;
