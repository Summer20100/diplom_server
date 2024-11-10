const { Router } = require("express");

const controllerFilms = require("../../controllers/admin/controllerFilms");

const router = Router();

router.get("/", controllerFilms.getFilms);
router.get("/:id", controllerFilms.getFilmsById);
router.post("/", controllerFilms.createFilm);
router.put("/:id", controllerFilms.updateFilm);
router.delete("/:id", controllerFilms.removeFilmById);

module.exports = router;
