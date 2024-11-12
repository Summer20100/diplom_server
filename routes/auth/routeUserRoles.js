const { Router } = require("express");
const controllerUserRole = require("../../controllers/auth/controllerUserRole");

const router = Router();

router.get("/", controllerUserRole.getUserRoles);
router.get("/:username", controllerUserRole.getUserRolesByUsername);
router.put("/:username", controllerUserRole.addRoleToUser);
router.delete("/:username", controllerUserRole.correctRoleByUser);

module.exports = router;

