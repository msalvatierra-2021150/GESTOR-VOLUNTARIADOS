const Admin = require('../models/adminApp');
const Fundacion  = require('../models/adminFundacion');
const Voluntario = require('../models/voluntario');
//Este archivo maneja validaciones personalizadas

const emailExiste = async( correo = '' ) => {
    const models = [Admin, Fundacion, Voluntario]; // Arreglo de modelos
    // Verificar si es Admin App, si no busca en fundacion, si no en voluntario
    let existeEmail = null;
    for (const model of models) {
        existeEmail = await model.findOne({ correo });
        if (existeEmail) {
            break;
        }
    }

    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo } ya existe y esta registrado en la DB`);
    }

}


const existeUsuarioPorId = async(id) => {
    const models = [Admin, Fundacion, Voluntario]; // Arreglo de modelos
    // Verificar si el usuario existe.
    let existeUser = null;
    for (const model of models) {
        existeUser = await model.findById(id);
        if (existeUser) {
            break;
        }
    }
    
    if (!existeUser) {
        throw new Error(`El id ${id} no existe en la DB`);
    }
}


module.exports = {
    emailExiste,
    existeUsuarioPorId
}