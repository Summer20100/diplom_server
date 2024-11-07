const { Router } = require("express");

const controllerChair = require("../controllers/controllerChair");

const router = Router();

router.get("/", controllerChair.getChairsTypes);
router.get("/:id", controllerChair.getChairsTypesById);
router.post("/", controllerChair.createChairsTypesById);
router.delete("/:id", controllerChair.deleteChairsTypeById);

module.exports = router;
