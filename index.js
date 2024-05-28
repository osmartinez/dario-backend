const express = require("express")
const mongoose= require("mongoose")
const cors = require("cors")
const userRoutes = require("./routes/user.routes")
const filmsRoutes = require("./routes/film.routes")

require("dotenv").config();
const app = express()

const port = process.env.PORT || 3000;
const host = process.env.HOST || process.env.FRONT_URL_VERCEL;

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json())

app.set("secretKey", process.env.JWTSECRET)


mongoose.connect(process.env.conectStream)
.then(() =>{
    console.log('Conexión con base de datos exitosa')
})
.catch((err)=>{
    console.log(err,"Error al conectar con base de datos")
})


app.use("/api/users", userRoutes)
app.use("/api/films", filmsRoutes)

app.listen(port, () =>{
    console.log('API funcionando en puerto 3000')
})

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }
 /*  
  const handler = (req, res) => {
    const d = new Date()
    res.end(JSON.stringify({ date: d.toString() }))
  }
  
  module.exports = allowCors(handler) */