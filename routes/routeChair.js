const { Router } = require("express");

const queriesChairs = require("../controllers/controllerChair");

const router = Router();

router.get("/", queriesChairs.getChairsTypes);
router.get("/:id", queriesChairs.getChairsTypesById);

module.exports = router;
