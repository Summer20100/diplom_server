const { Router } = require("express");
const conrtollerRoles = require("../../controllers/auth/controllerRole");

const router = Router();

router.get("/", conrtollerRoles.getRoles);
router.post("/", conrtollerRoles.createRole);
router.delete("/:value", conrtollerRoles.deleteRole);

module.exports = router;
