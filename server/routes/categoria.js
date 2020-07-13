const express = require('express')
const {verificaToken, verificaAdminRol} = require('../middleware/autenticacion')
const app = express()

const Categoria = require('../model/Categoria')
const { DocumentProvider } = require('mongoose')

//5 Servicios

//Devuelve todas las categorias
app.get('/categoria', verificaToken,(req, res) => {
    let query = Categoria.find()
    query.populate('usuario').exec()
    .then(docCategoria => {
        res.json({
            ok: true,
            categorias: docCategoria
        })
        
    }, err => {
        res.status(404).json({
            ok: false,
            err
        })
    })
})

//Mostrar una categoria por ID
app.get('/categoria/:id', (req, res) => {
    //Categoria.findById()
    let id = req.params.id
    Categoria.findById(id)
    .then(docCategoria => {
        res.json({
            ok: true,
            docCategoria
        })
    })
    .catch(err => {
        res.json({
            ok: false,
            err
        })
    })
})

//Crear una nueva categoria y regresa esa misma como feedback hacia el usuario
app.post('/categoria', [verificaToken, verificaAdminRol],(req, res) => {
    //req.usuario._id //Ahi se encuentra el id del usuario con un token valido
    let doc_categoria = new Categoria({
        usuario: req.usuario._id, //Id recuperado del JWT
        descripcion: req.body.descripcion
    }) 

    doc_categoria.save()
    .then(docCategoria => {
        res.json({
            ok: true,
            docCategoria
        })
    })
    .catch(err => {
        res.status(404).json({
            ok: false,
            err
        })
    })
})

//Actualiza una categoria, solo el nombre | descripcion
app.put('/categoria/:id', [verificaToken,verificaAdminRol],(req, res) => {
    let id = req.params.id
    let updateObj = req.body
    Categoria.findByIdAndUpdate(id, updateObj, {new: true, runValidators: true, context: 'query'}, (err, docCategoria) => {
        
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            docCategoria
        })

    })
})


//Borra una categoria bajo las siguientes condiciones:
//- El usuario debe se ADMIN_ROL
//- Y el token debe ser válido
//La categoría se elimina de manera física
app.delete('/categoria/:id', [verificaToken, verificaAdminRol],(req, res) => {
    let id = req.params.id
    Categoria.findByIdAndDelete(id, (err, docCategoria) => {
        if(err)
            return res.status(400).json({
                ok: false,
                err
            })
        res.json({
            ok: true,
            docCategoria
        })
    })
})


module.exports = app;