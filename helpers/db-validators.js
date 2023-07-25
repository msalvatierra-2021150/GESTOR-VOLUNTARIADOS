const Admin = require('../models/adminApp');
const Fundacion  = require('../models/adminFundacion');
const Voluntario = require('../models/voluntario');
const Convocatoria = require('../models/convocatoria');
//Este archivo maneja validaciones 
const UIploadModel = require('../models/voluntario');


const emailExistente = async( correo = '' ) => {
    console.log("SE ENTRO");
    //Verificamos si el correo ya existe en la DB
    const existeEmail = await UIploadModel.findOne( { correo } );
    console.log(existeEmail);
    //Si existe (es true) lanzamos excepción
    if ( existeEmail ) {
        return  res.status(400).json({
                 msg: 'Usuario / Password no son correctos - (El correo no existe jaja)'
         });
    }

}

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

//Verificador si la convocatoria es de la fundacion que esta intentado acceder
const esConvocatoriaDeLaFundacion = async (id, idFundacion) => {
    const convocatoria = await Convocatoria.findById(id);
    if (convocatoria.fundacion.toString() !== idFundacion) return false;
    return true;
}

module.exports = {
    emailExiste,
    existeUsuarioPorId,
    esConvocatoriaDeLaFundacion,
    emailExistente,
    
}