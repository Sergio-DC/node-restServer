const jwt = require('jsonwebtoken')
// const { json } = require('body-parser')

let verificaToken = (req, res, next) => {
    let token = req.get('token')
    jwt.verify(token, process.env.SEED, (err, decoded) => {//decoded- is the payload
        if(err){
            return res.status(401).json({//Unauthorized
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario
        next()
            
    })   


    
}


//Verifica Admin ROL
let verificaAdminRol = (req, res, next) => {
    let usuario = req.usuario
    if(usuario.role === 'ADMIN_ROLE')
        next()
    else {
        return res.json({
            ok: false,
            message: 'El usuario no es administrador'
        })
    }

}

module.exports = {
    verificaToken,
    verificaAdminRol
}