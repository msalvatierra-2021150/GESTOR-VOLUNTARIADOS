const { Schema, model } = require('mongoose');

const adminFundacionSchema = Schema({
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
    sitio_web: {
        type: String
    },
    telefono: {
        type: String
    },
    direccion: {
        type: String
    },
    horarios: {
        type: String
    },
    convocatorias_realizadas: {
        type: Number,
        default: 0
    },
    array_img: {
        type: Array,
        default: []
    },
    rol: {
        type: String,
        required: true
    }
});


module.exports = model('Fundacion', adminFundacionSchema);