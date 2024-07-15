const { Router } = require("express");
// const { getUsers, getUser, createUser, updateUser, deleteUser } = require("./controller");
//const { getUsers, getUserById, addUser, updateUser, removeUser, paginationUser, getUserByName } = require("./controller");
const controller = require("./controller");

const router = Router();

router.get("/from=:from&to=:to", controller.paginationUser);
router.get("/", controller.getUsers); // http://localhost:5000/75ad4124-e29d-4925-904b-a96bb9c84fce/api/v1/users?page=<page_number>&size=<page_size>
router.post("/", controller.addUser);  // http://localhost:5000/75ad4124-e29d-4925-904b-a96bb9c84fce/api/v1/users/
router.get("/:id", controller.getUserById);  //  http://localhost:5000/.../api/v1/users/<id>  http://localhost:5000/.../api/v1/users/search?name=<search_query>
router.put("/:id", controller.updateUser);  // http://localhost:5000/75ad4124-e29d-4925-904b-a96bb9c84fce/api/v1/users/250?name_en=<...>&name_ru=<...>&position=<...>&department=<...>&location=<...>&email=<...>&internal_phone=<...>&mobile_phone=<...>&actual_location=<...>&birthday=<...>
router.delete("/:id", controller.removeUser); //  http://localhost:5000/75ad4124-e29d-4925-904b-a96bb9c84fce/api/v1/users/<id>

module.exports = router;

