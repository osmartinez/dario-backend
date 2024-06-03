const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function searchUsers(){
  const usuarios = await User.find({});
  return usuarios;
};

/**
 * @param {} body 
 * @returns devulve el usuario creado, con un rol= "user" por defecto y una contraseña encriptada.
 */
async function signup(body) {
  const hash = await bcrypt.hash(body.password, 12);
  const newUser = new User({
    email: body.email,
    password: hash,
    role: "user",
    name: body.name,
  });
  await newUser.save();
  return newUser;
}


/**
 * 
 * @param {*} email 
 * @returns devulve el usuario encontrado para confirmar que existe en la base de datos y pueda iniciar sesión
 */
async function login(email) {
  const usuarioEncontrado = await User.findOne({ email: email });
  return usuarioEncontrado
}

async function cambiarUsuario(id, usuario) {
  try {
    modificacionUsuario = {
      email: usuario.email,
      password: await bcrypt.hash(usuario.password, 12),
      role: usuario.role,
      name: usuario.name,
    };
    const usuarioModificado = await User.findByIdAndUpdate(
      id,
      modificacionUsuario
    );
    return usuarioModificado;
  } catch {
    res.status(500).json({ msg: "error interno al registrarse" });
  }
}

async function modifyPwd(id, nuevaPassword) {
    const newPwdCrypt = await bcrypt.hash(nuevaPassword, 12);
    const objNewPwdCrypt = {
      password: newPwdCrypt,
    };
    const userToModifyPwd = await User.findByIdAndUpdate(id, objNewPwdCrypt);
    return userToModifyPwd;
}

/**
 * 
 * @param {*} id 
 * @returns nos devuelve el usuario que acabamos de borrar con ese id
 */
async function deleteUser(id) {
  const usuarioBorrado = await User.findByIdAndDelete(id);
  return usuarioBorrado;
}


module.exports = {
  searchUsers,
  signup,
  login,
  cambiarUsuario,
  modifyPwd,
  deleteUser
};
