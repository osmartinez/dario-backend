const express = require("express");
const router = express.Router();
const {
  findAll,
  findById,
  insert,
  deleteOne,
} = require("../controllers/film.controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth.middleware");

router.get("/", isAuthenticated, async (req,res) => {
  try {
    const films = await findAll();
    return res.status(200).json(films);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "error en la busqueda de las películas" });
  }
});
router.get("/:id", isAuthenticated, async (req,res) =>{
  try {
    const film = await findById(req.params.id);
    return res.status(200).json(film);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "error en la busqueda de la película con dicho ID" });
  }
});


router.post("/", isAdmin, async (req,res) =>{
  try {
    const newFilm = await insert(req.body)
    return res.status(200).json({msg: "película creada con éxito", newFilm})
  } catch(error) {
    return res.status(500).json({ msg: "error al guardar la pelicula" });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const filmDeleted = await deleteOne(req.params.id);
    return res.status(200).json({ msg: "pelicula elminada: ", filmDeleted });
  } catch (error) {
    return res.status(500).json({ msg: "error interno del servidor" });
  }
});

module.exports = router;
