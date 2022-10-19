const express = require('express');
const { dbConnection } = require('../database/config');
require('dotenv').config(); //importar variables de entorno
const cors = require('cors')

//crear el servidor de express

const app = express();

//BD
dbConnection();

//CORS
app.use(cors())


//escuchar peticiones

app.listen(process.env.PORT, () => {
    console.log(`servidor corriendo en puerto ${process.env.PORT}`)
})

// Directorio público
//middleware
app.use(express.static('public'));

//lectura y parseo del body
app.use(express.json());


// rutas
//app.use('/login', require('./public/build/static'));
app.use('/login', express.static('public'));
app.use('/api/auth', require('../routes/auth'))
app.use('/api/events', require('../routes/events'))