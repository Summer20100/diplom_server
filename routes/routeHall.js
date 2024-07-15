const { Router } = require("express");

const queriesHalls = require("../controllers/controllerHall");

const router = Router();

router.get("/", queriesHalls.getHalls);
router.post("/", queriesHalls.addHall);
router.get("/:id", queriesHalls.getHallById);
router.delete("/:id", queriesHalls.removeHall);

module.exports = router;
