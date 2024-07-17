const { Router } = require("express");

const controllerHallChairs = require("../controllers/controllerHallChairs");

const router = Router();

router.get("/", controllerHallChairs.getHallChairs);
router.get("/:id", controllerHallChairs.getHallChairsById);
router.get("/create", controllerHallChairs.createTableHallChairs);
router.post("/", controllerHallChairs.addHallChairs)

// router.post("/", queriesHalls.addHall);
// router.get("/:id", queriesHalls.getHallById);
// router.delete("/:id", queriesHalls.removeHall);

module.exports = router;
