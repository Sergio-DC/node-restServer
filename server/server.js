require('./config/config');
const express = require('express');
const mongoose = require('mongoose')
const app = express();
const bodyParser = require('body-parser');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

//parse application json
app.use(bodyParser.json());
//Rutas
app.use(require('./routes/index'))

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto 3000');    
});

console.log("REsp: ", process.env.URL_DB)
mongoose.connect(process.env.URL_DB, err => {
    if(err) throw err
    console.log("Conexion establecida a la BD: ")
})