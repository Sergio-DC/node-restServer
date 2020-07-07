const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../model/Usuario')
const app = express()

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
  

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
    .catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        })
    })

    //Verificar en la db un usuario que tenga el mismo correo
    let filter = {email: googleUser.email}
    Usuario.findOne(filter, (err, docUsuario) => {
        if(err) {
            res.status(500).json({
                ok: false,
                err
            })
        }

        if( docUsuario ) {
            if(docUsuario.google === false) {//Es un usuario que ya se autentico con credenciales normales
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: docUsuario
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

                return res.json({
                    ok: true,
                    usuario: docUsuario,
                    token
                })
            }
        } else { // Si el usuario no existe en la BD
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = ':)'

            usuario.save((err, docUsuario) => {
                if(err) {
                    res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: docUsuario
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

                return res.json({
                    ok: true,
                    usuario: docUsuario,
                    token
                })
            })
        }
    })
    res.json({
        usuario: googleUser
    })
})

module.exports = app