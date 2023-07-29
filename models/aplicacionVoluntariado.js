const { Schema, model } = require('mongoose');

const aplicacionVoluntariadoSchema = Schema({
    voluntario: {
        type: Schema.Types.ObjectId,
        ref: 'voluntario',
        
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'AdminApp',
       
    },
    convocatoria: {
        type: Schema.Types.ObjectId,
        ref: 'Convocatoria',
        required: true
    },
    estado: {
        type: String,
        default: 'Pendiente'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('AplicacionVoluntariado', aplicacionVoluntariadoSchema);