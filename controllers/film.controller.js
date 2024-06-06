const Film = require("../models/film.model");

async function findAll(){
    const films = await Film.find();
    return films;
}

async function findById(id){
    const film = await Film.findById(id);
    return film;
}

async function insert(body) {
    const newFilm = new Film({
      title: body.title,
      synopsis: body.synopsis,
      img: body.img,
      director: body.director,
      year: body.year,
      category: body.category,
    });
    await newFilm.save();
    return  newFilm
}

async function deleteOne(id) {
  const filmDeleted = await Film.findByIdAndDelete(id);
  return filmDeleted;
}


module.exports = {
    findAll,
    findById,
    insert,
    deleteOne,
}