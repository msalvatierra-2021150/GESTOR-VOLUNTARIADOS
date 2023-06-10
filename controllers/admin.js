const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const adminApp = require('../models/adminApp');

const getAdmin = async (req = request, res = response) => {
    try{
        const { id } = req.usuario;

        const adminapp = await adminApp.findById(id);

        return res.json({
            msg: 'get Api - Controlador Admin',
            adminapp
        });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}

const postAdmin = async (req = request, res = response) => {
    //Desestructuración
    const { nombre, correo, password} = req.body;
    const rol = req.body.rol || 'ADMIN_APP';

    const adminAppGuardadoDB = new adminApp({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    adminAppGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await adminAppGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Admin',
        adminAppGuardadoDB
    });

}


const putAdmin = async (req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const  id  = req.usuario.id;
    const { _id, img,  rol,  estado, google, ...resto } = req.body;
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)

    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

        const adminAppEditado = await adminApp.findByIdAndUpdate(id, resto);
        return res.json({
            msg: 'PUT editar Admin',
            usuarioEditado: adminAppEditado
        });
}

const deleteAdmin = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.usuario;

    //Eliminar cambiando el estado a false
    const adminAppEliminado = await adminApp.findByIdAndDelete(id);

    return res.json({
        msg: 'DELETE eliminar AdminApp',
        adminAppEliminado
    });
}


module.exports = {
    getAdmin,
    postAdmin,
    putAdmin,
    deleteAdmin
}


// CONTROLADOR