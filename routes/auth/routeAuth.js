const { Router } = require("express");
const { check } = require("express-validator");
const controllerAuth = require("../../controllers/auth/controllerAuth");
const middlewareAuth = require("../../middleware/middlewareAuth");
const middlewareRole = require("../../middleware/middlewareRole");

const router = Router();

router.post("/registration", [
    check("username", "Имя пользователя обязательно").notEmpty(),
    check("password", "Пароль обязателен").notEmpty(),
    check("password", "Пароль больше 4 и меньше 10 символов").isLength({min: 4, max:10})
], controllerAuth.registration);
router.post("/login", controllerAuth.login);
router.get("/users", middlewareRole(["USER", "ADMIN"]), controllerAuth.getUsers);

module.exports = router;
