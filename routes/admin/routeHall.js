const { Router } = require("express");

const controllerHall = require("../../controllers/admin/controllerHall");

const router = Router();

router.get("/", controllerHall.getHalls);
router.post("/", controllerHall.addHall);
router.get("/:id", controllerHall.getHallById);
router.delete("/:id", controllerHall.removeHall);

module.exports = router;
