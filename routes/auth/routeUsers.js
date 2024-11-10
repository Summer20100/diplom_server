const { Router } = require("express");
const conrtollerUsers = require("../../controllers/auth/conrtollerUsers");

const router = Router();

router.get("/", conrtollerUsers.getUsers);
router.get("/", conrtollerUsers.getUserByUsername);

router.post("/", conrtollerUsers.createUser);
router.delete("/:username", conrtollerUsers.deleteUser);

module.exports = router;
