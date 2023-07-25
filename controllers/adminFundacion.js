const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importar Modelo
const adminFundacion = require("../models/adminFundacion");
const { eliminarFile } = require('../helpers/configByFireBase');
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

        const { nombre, acerca_de, correo, password, sitio_web, telefono, direccion, horarios, fotoPerfil, fotoFondo, facebook, instagram, twitter } = req.body;
        if (fotoPerfil === '') {
            return res.status(400).json({
                msg: 'Agregue ssu foto de perfil por por favor'
            });
        }
        if (fotoFondo === '') {

            return res.status(400).json({
                msg: 'Agregue su foto de fondo por por favor'
            });
        }
        if (correo === '') {
            eliminarFile(fotoFondo);
            eliminarFile(fotoPerfil);
            return res.status(400).json({
                msg: 'Agregue su correo por favor'
            });
        }
        if (password === '') {
            eliminarFile(fotoFondo);
            eliminarFile(fotoPerfil);
            return res.status(400).json({
                msg: 'Agregue su password por favor'
            });
        }
        if (acerca_de === '') {
            eliminarFile(fotoFondo);
            eliminarFile(fotoPerfil);
            return res.status(400).json({
                msg: 'Agregue su acerca_de por favor'
            });
        }
        if (nombre === '') {
            eliminarFile(fotoFondo);
            eliminarFile(fotoPerfil);
            return res.status(400).json({
                msg: 'Agregue su nombre por favor'
            });
        }

        const existeEmail = await adminFundacion.findOne({ correo });

        if (existeEmail) {

            return res.status(400).json({
                msg: `El correo ${correo} ya esta registrado`
            });
        }

        const fundacionDB = new adminFundacion(
            {
                nombre,
                acerca_de,
                correo,
                password,
                sitio_web,
                telefono,
                direccion,
                horarios,
                fotoPerfil,
                fotoFondo,
                facebook,
                instagram,
                twitter,
            });
        const salt = bcrypt.genSaltSync();


        fundacionDB.password = bcrypt.hashSync(fundacionDB.password, salt);
        //Guardar en BD
        await fundacionDB.save();
        return res.json({ msg: 'Fundación creada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
}

const putAdminFundacion = async (req = request, res = response) => {

    try {
        const id = req.usuario.id;
        const { nombre, acerca_de, correo, password, sitio_web, telefono, direccion, horarios, fotoPerfil, fotoFondo, facebook, instagram, twitter } = req.body;
        console.log(fotoPerfil);
        console.log(fotoFondo);
        const fundacionFiles = await adminFundacion.findById(id);
        let photoPerfil = fundacionFiles.fotoPerfil;
        let photoFondo = fundacionFiles.fotoFondo;

        if (fotoPerfil !== '') {
           
            eliminarFile(photoPerfil);
            photoPerfil = fotoPerfil
        }
        if (fotoFondo !== '') {
            
            eliminarFile(photoFondo);
            photoFondo = fotoFondo
        }
        const datos = {
            nombre, 
            acerca_de, 
            correo, 
            password, 
            sitio_web, 
            telefono, 
            direccion, 
            horarios, 
            fotoPerfil:photoPerfil,
            fotoFondo:photoFondo,
            facebook, 
            instagram, 
            twitter
          }

        await adminFundacion.findByIdAndUpdate(id, datos);
        return res.json({ msg: 'Fundación modificada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const deleteAdminFundacion = async (req = request, res = response) => {

    try {
        const id = req.usuario.id;
        const fundacion = await adminFundacion.findById(id);
        const { fotoFondo, fotoPerfil } = fundacion;
        eliminarFile(fotoFondo);
        eliminarFile(fotoPerfil);

        await adminFundacion.findByIdAndDelete(id);
        return res.json({ msg: 'Fundación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}
const getFundacionNombre = async (req = request, res = response) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;
        const regex = new RegExp(req.params.nombre, 'i');
        const [fundaciones, totalFundaciones] = await Promise.all([
            adminFundacion.find({ nombre: regex }, 'nombre correo sitio_web telefono').skip(desde).limit(limite),
            adminFundacion.find({ nombre: regex }).countDocuments()
        ]);
        return res.json({ fundaciones, totalFundaciones });
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const contarFundaciones = async (req = request, res = response) => {
    try {
       const  cantidadFundaciones = await adminFundacion.countDocuments();
        return res.json({ cantidadFundaciones });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}



module.exports = {
    getFundacionNombre,
    getAdminFundacion,
    getAllAdminsFundaciones,
    postAdminFundacion,
    putAdminFundacion,
    deleteAdminFundacion,
    contarFundaciones,
};
