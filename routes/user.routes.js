const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  login,
  signup,
  searchUsers,
  cambiarUsuario,
  modifyPwd,
  deleteUser,
} = require("../controllers/user.controller");

const { isAdmin, isAuthenticated } = require("../middleware/auth.middleware");
const {pwdIguales, middleWareVerifYCambioContrasena} = require ("../middleware/usuario.middleware")

router.get("/", isAdmin, async (req, res) => {
  try {
    const usuarios = await searchUsers();
    res.status(200).json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "error interno del servidor para buscar users" });
  }
});

/**
 * Ruta para registrar un usuario
 */
router.post("/signup", pwdIguales, async (req, res) => {
  try {
    const usuarioRegistrado = await signup(req.body);
    return res.json({ msg: "registro correcto", usuarioRegistrado });
  } catch (error) {
    res.status(500).json({ msg: "error al registrase" });
  }
});

/*
 * Esta ruta servirá para iniciar sesión del usuario, y la cuál devolverá un token, un rol, nombre de usuario y su id
 */
router.post("/login", async (req, res) => {
  try {
    const usuarioEncontrado = await login(req.body.email);
    if (!usuarioEncontrado) {
      return res.status(400).json({ msg: "credenciales no validas"});
    } else {
      const compararResultado = await bcrypt.compare(
        req.body.password,
        usuarioEncontrado.password
      );
      if (!compararResultado) {
        return res.status(400).json({ msg: "credenciales no validas" });
      } else {
        const token = jwt.sign(
          { userId: usuarioEncontrado._id },
          process.env.JWTSECRET,
          {
            expiresIn: "2h",
          }
        );
        return res.status(200).json({
          msg: "logeado correctamente",
          token: token,
          role: usuarioEncontrado.role,
          nombre: usuarioEncontrado.name,
          usuarioId: usuarioEncontrado._id
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "error al logear" });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const usuarioBorrado = await deleteUser(req.params.id);
    return res.status(200).json({ msg: "usuario eliminado: ", usuarioBorrado });
  } catch (error) {
    res.status(500).json({ msg: "error interno del servidor" });
  }
});
/* 
* Para modificar un usuario, tendremos que poner en la ruta el "id" del usuario a modificar y añadir la query "?token=..(token de admin).."
* Solo de esta forma, estando loggeado como admin y con el id del usuario a modificar, se podrá modificar y poner otro usuario con role admin.
 */
router.put("/:id", isAdmin, async (req, res) => {
  try {
    await cambiarUsuario(req.params.id, req.body);
    return res
      .status(200)
      .json({ msg: "el usurio ha sido modificado con exito" });
  } catch (error) {
    res.status(500).json({ msg: "error interno del servidor" });
  }
});

/* 
* El usuario necesitará estar loggeado (dentro de su cuenta), para modificar su contraseña
 */
router.patch(
  "/:id",
  isAuthenticated,
  middleWareVerifYCambioContrasena,
  async (req, res) => {
    try {
      await modifyPwd(req.params.id, req.body.nuevaPassword);
      res
        .status(200)
        .json({ msg: "la contraseña ha sido modificada con éxito" });
    } catch (error) {
      res.status(500).json({ msg: "error interno del servidor" });
      console.error(error);
    }
  }
);


module.exports = router;
