const { json } = require('express');
const UIploadModel = require('../models/ModelsPdf');

const emailExiste = async( correo = '' ) => {
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

module.exports = {
    emailExiste,
    
}