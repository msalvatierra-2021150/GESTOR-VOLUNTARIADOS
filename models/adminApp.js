const { Schema, model } = require('mongoose');

const adminAppSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio' ]
    },
    rol: {
        type: String,
        required: true
    },
    array_img: {
        type: Array,
        default: []
    }
});


module.exports = model('AdminApp', adminAppSchema);