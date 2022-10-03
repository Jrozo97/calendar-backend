const express = require('express');
const cors = require('cors');

const { dbConecction } = require('./database/config');
require('dotenv').config();


// Crear el servidor de express
const app = express();

//Base de datos
dbConecction();

//CORS
app.use(cors());

// Directorio Público
app.use( express.static('public') )

//Lectura y parseo del body
app.use( express.json() );


//Rutas
app.use('/api/auth', require('./routes/auth') );

// TODO: CRUD: Eventos


// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
} )
