const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importar Modelo
const adminFundacion = require("../models/adminFundacion");

const getAdminFundacion = async (req = request, res = response) => {
    try {
        const query = { _id: req.usuario.id };
        const fundacion = await adminFundacion.findById(query);
        return res.json({ fundacion });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const getAllAdminsFundaciones = async (req = request, res = response) => {
    try {
        const fundaciones = await adminFundacion.find();
        return res.json({ fundaciones });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const postAdminFundacion = async (req = request, res = response) => {
    try {
        const { ...data } = req.body;
        const fundacionDB = new adminFundacion({ ...data });
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        fundacionDB.password = bcrypt.hashSync(fundacionDB.password, salt);
        //Guardar en BD
        await fundacionDB.save();
        return res.json({ msg: 'Fundación creada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const putAdminFundacion = async (req = request, res = response) => {
    try {
        const id = req.usuario.id;
        const { _id, rol, ...data } = req.body;
        //Si la password existe o viene en el req.body, la encripta
        if (data.password) {
            //Encriptar password
            const salt = bcrypt.genSaltSync();
            data.password = bcrypt.hashSync(data.password, salt);
        } 
        //Guardar en BD
        await adminFundacion.findByIdAndUpdate(id, data);
        return res.json({ msg: 'Fundación modificada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const deleteAdminFundacion = async (req = request, res = response) => {
    try {
        const id = req.usuario.id;
        await adminFundacion.findByIdAndDelete(id);
        return res.json({ msg: 'Fundación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

module.exports = {
    getAdminFundacion,
    getAllAdminsFundaciones,
    postAdminFundacion,
    putAdminFundacion,
    deleteAdminFundacion
};
