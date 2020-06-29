const mongoose = require('mongoose')
//const unique_validator = require('mongoose-unique-validator')

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'No es un rol valido'
}


const Schema = mongoose.Schema

const schemaUsuario = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'EL correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean, 
        default: false
    }
    
})
//El método toJSON en un esquema siempre se llama cuando se intenta imprimir
schemaUsuario.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}
//schemaUsuario.plugin(unique_validator, {message: '{PATH} debe de ser unico'})
const Usuario = mongoose.model('Usuario', schemaUsuario)

module.exports = Usuario
