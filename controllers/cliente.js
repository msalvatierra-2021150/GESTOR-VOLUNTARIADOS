const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');

const getUsuarios = async (req = request, res = response) => {
    //condiciones del get
    const query = { estado: true , _id: req.usuario.id};

    const listaUsuarios = await Usuario.findById(query);
        return res.json({
            msg: 'get Api - Controlador Usuario',
            listaUsuarios
        });
}

const postUsuario = async (req = request, res = response) => {

    //Desestructuración
    const { nombre, correo, password} = req.body;
    rol = 'USUARIO_ROLE';
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });

}


const putUsuario = async (req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.usuario;
    const { _id, img,  rol,  estado, google, ...resto } = req.body;
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)

    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

        //Editar al usuario por el id
        const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);
        return res.json({
            msg: 'PUT editar user',
            usuarioEditado
        });
}

const deleteUsuario = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.usuario;

        //Eliminar cambiando el estado a false
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);

        return res.json({
            msg: 'DELETE eliminar user',
            usuarioEliminado
        });
}

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}


// CONTROLADOR