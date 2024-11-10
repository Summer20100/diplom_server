const { Router } = require("express");
const controllerUserRole = require("../../controllers/auth/controllerUserRole");

const router = Router();

router.get("/", controllerUserRole.getUserRoles);
router.get("/:username", controllerUserRole.getUserRolesByUsername);

module.exports = router;

