const express = require('express')
const { verificaToken } = require('../middleware/autenticacion')
const app = express()
const Producto = require('../model/Producto')


//Obtener todos los producto
app.get('/productos', (req, res) => {
    //Usar populate para cargar: usuario y categoria
    //paginado
})

//Obtener un producto por ID
app.get('/productos/:id', (req, res)  => {
    //Usar populate para cargar: usuario y categoria
})

//Crear un producto
app.post('/productos', (req, res)  => {
    //Grabar el usuario
    //Grabar una categoria del listado
    let body = req.body
    Producto.create(body, {validateBeforeSave: true})
    .then(docProducto => {
        res.json({
            ok: true,
            message: 'Product Saved',
            docProducto
        })
    }).catch(err => {
        res.status(404).json({
            ok: false,
            err
        })
    })
})

//Actualoizar un producto
app.put('/productos/:id', (req, res)  => {
    //Usar populate para cargar: usuario y categoria
})

//Borrar un producto
app.delete('/productos/:id', (req, res)  => {
    //Borrar de manera lógica
})

module.exports = app