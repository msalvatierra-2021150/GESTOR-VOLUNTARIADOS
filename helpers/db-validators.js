const Role = require('../models/role');
const Usuario = require('../models/usuario');


//Este archivo maneja validaciones personalizadas

const esRoleValido = async( rol = '' ) => {

    const existeRol = await Role.findOne( { rol } );

    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la DB`);
    }

}


const emailExiste = async( correo = '' ) => {

    //Verificamos si el correo ya existe en la DB
    const existeEmail = await Usuario.findOne( { correo } );

    //Si existe (es true) lanzamos excepción
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo } ya existe y esta registrado en la DB`);
    }

}


const existeUsuarioPorId = async(id) => {

    //Verificar si el ID existe
    const existeUser = await Usuario.findById(id);

    if ( !existeUser ) {
        throw new Error(`El id ${ id } no existe en la DB`);
    }

}

const existeRol = async(rol) => {

    //Verificar si el ID existe
    const existeRol = await Role.findOne({rol: rol});

    if ( existeRol ) {
        throw new Error(`El rol ${ rol } ya existe en la DB`);
    }
}

const existeRolPorId = async(id) => {
    //Verificar si el ID existe
    const existeRol = await Role.findOne({id: id});

    if ( existeRol ) {
        throw new Error(`El rol ${ id } ya existe en la DB`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeRol,
    existeRolPorId
}