const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../model/Usuario')
const app = express()

app.post('/login', (req, res) => {
    let body = req.body
    let filter = {email: body.email}
    Usuario.findOne(filter, (err, docUsuario) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!docUsuario) {
            return res.status(400).json({
                ok: false,
                message: 'The Email does not exist'
            })
        }
        console.log("Password: ", body.password);
        if( !bcrypt.compareSync(body.password, docUsuario.password) ) {
            return res.status(400).json({
                ok: false,
                message: "Incorrect Password"
            })
        }
        
        let token = jwt.sign({
            usuario: docUsuario
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN}) //Expires in 30 Day, fmt: secs-mins-hours-days

        res.json({
            ok: true,
            usuario: docUsuario,
            token
        })
    })
})

module.exports = app