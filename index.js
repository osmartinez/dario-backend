const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const filmsRoutes = require("./routes/film.routes");

require("dotenv").config();
const app = express();

const port = process.env.PORT || 3000;
/* const host = process.env.HOST || process.env.FRONT_URL_VERCEL; */

/* var corsOptions = {
    origin:['http://localhost:4200', 'https://paradise-films-frontend-angular-js.vercel.app'],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
}; */
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://paradise-films-frontend-angular-js.vercel.app",
      "*"
    ],
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app.set("secretKey", "secret123");

mongoose
  .connect(
    "mongodb+srv://itsosmartinez:jomlyIhVM9Bj8ueT@cluster0.fabyljk.mongodb.net/dariofilms"
  )
  .then(() => {
    console.log("Conexión con base de datos exitosa");
  })
  .catch((err) => {
    console.log(err, "Error al conectar con base de datos");
  });

app.use("/api/users", userRoutes);
app.use("/api/films", filmsRoutes);

app.get("/", (req, res) => {
  res.send("Express on Vercel 🚀");
});


app.listen(port, () => {
  console.log(`API funcionando en puerto ${port}`);
});

module.exports = app