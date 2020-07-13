const mongoose = require('mongoose')
const Schema = mongoose.Schema
var uniqueValidator = require('mongoose-unique-validator');

const schemaCategoria = new Schema({
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    descripcion: {
        type: String,
        required: true,
        unique: true
    },
    productos: [{
        _id: mongoose.Types.ObjectId
    }]
})


schemaCategoria.plugin(uniqueValidator);
const Categoria = mongoose.model("Categoria", schemaCategoria)

module.exports = Categoria