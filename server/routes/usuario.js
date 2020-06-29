const express = require('express')
const app = express()
const Usuario = require('../model/Usuario')
const bcrypt = require('bcrypt')
const _ = require('underscore')

app.get('/usuario', function(req, res){
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5
    let estado = Number(req.query.estado) || true

    Usuario.find({estado}, 'role estado google nombre email')
            .skip(desde)
            .limit(limite)
            .exec((err, docUsuarioArray) => {
                if(err) {
                    return res.status(400).json({
                        ok: false, 
                        err
                    })
                }

                Usuario.count({estado}, (err, count) => {
                    res.json({
                        ok: true,
                        docUsuarioArray,
                        count
                    })
                })
            })
});

app.post('/usuario', function(req, res){
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, docUsuario) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //docUsuario.password = null
        res.json({
            ok: true,
            usuario: docUsuario
        })
    });
})

app.put('/usuario/:id', function(req, res){
    let id = req.params.id;
    //let body = req.body
    let body = _.pick(req.body, ['email','img','role','estado', 'nombre'])
        
    Usuario.findByIdAndUpdate(id,body,{new: true, runValidators: true} ,(err, doc) => {
        if(err) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok: true,
            doc
        })
    })
})

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['estado'])

    // Usuario.findByIdAndRemove(id, (err, docUsuario) => {
    //     if(err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if(!docUsuario) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         docUsuario
    //     })
    // })

    Usuario.findByIdAndUpdate(id, body,{new: true} ,(err, docUsuario) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            docUsuario
        })
    }) 
})

module.exports = app