const { response, request } = require('express');
//Importar Modelos
const Convocatoria = require('../models/convocatoria');
const Fundacion = require('../models/adminFundacion');
const ContadoresConvocatoria = require('../models/contadoresConvocatoria');
//Creacion de los contadores de la convocatoria
const { postContadoresConvocatoriaPrimeraVez } = require('../controllers/contadoresConvocatoria');
//Evaluar si la convocatoria es de la fundacion que esta intentado acceder
const { esConvocatoriaDeLaFundacion } = require('../helpers/db-validators');

//Fundacion
const getConvocatorias = async (req = request, res = response) => {
    try {
        const query = { fundacion: req.usuario.id, estado: true };
        const convocatorias = await Convocatoria.find(query);
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Fundacion
const getConvocatoriasCerradas = async (req = request, res = response) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;
        const query = { fundacion: req.usuario.id, estado: false };
        const [convocatorias, totalConvocatoria] = await Promise.all([
            Convocatoria.find(query).skip(desde).limit(limite),
            Convocatoria.countDocuments(query)
        ]);
        return res.json({ convocatorias, totalConvocatoria });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Voluntario
const getConvocatoriasLugar = async (req = request, res = response) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;
        const regexTitulo = new RegExp(req.params.titulo, 'i');
        let coincidencias = [];
        let registros = 0;
        if (req.params.lugar === null) {
            const [convocatorias, totalConvocatoria] = await Promise.all([
                Convocatoria.find({
                    $and: [
                        { titulo: regexTitulo },
                        { estado: true }
                    ]
                }).skip(desde).limit(limite).populate('fundacion', 'nombre'),
                Convocatoria.countDocuments({
                    $and: [
                        { titulo: regexTitulo },
                        { estado: true }
                    ]
                })
            ]);
            coincidencias = convocatorias;
            registros = totalConvocatoria;
        } else {
            const regexLugar = new RegExp(req.params.lugar, 'i');
            const [convocatorias, totalConvocatoria] = await Promise.all([
                Convocatoria.find({
                    $and: [
                        { lugar: regexLugar },
                        { titulo: regexTitulo },
                        { estado: true }
                    ]
                }).skip(desde).limit(limite).populate('fundacion', 'nombre'),
                Convocatoria.countDocuments({
                    $and: [
                        { lugar: regexLugar },
                        { titulo: regexTitulo },
                        { estado: true }
                    ]
                })
            ]);
            coincidencias = convocatorias;
            registros = totalConvocatoria;
        }
        return res.json({ coincidencias, registros });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Voluntario
const getConvocatoriasActivas = async (req = request, res = response) => {
    try {
        const query = { estado: true };
        const convocatorias = await Convocatoria.find(query);
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Admin y Fundacion
const getAllConvocatorias = async (req = request, res = response) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 5;
        const query = { fundacion: req.usuario.id, estado: true };
        const [convocatorias, totalConvocatoria] = await Promise.all([
            Convocatoria.find(query).skip(desde).limit(limite).populate('fundacion', 'nombre'),
            Convocatoria.countDocuments()
        ]);
        return res.json({ convocatorias, totalConvocatoria });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Admin
const getConvocatoriaNombre = async (req = request, res = response) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 0;
        const regexNombre = new RegExp(req.params.nombre, 'i');
        const [convocatorias, totalConvocatoria] = await Promise.all([
            Convocatoria.find({ titulo: regexNombre }, 'titulo lugar fecha_inicio fecha_fin cupo')
                .skip(desde)
                .limit(limite)
                .populate('fundacion', 'nombre'),
            Convocatoria.countDocuments({ titulo: regexNombre })
        ]);
        return res.json({ convocatorias, totalConvocatoria });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Fundacion
const postConvocatoria = async (req = request, res = response) => {
    try {
        const { ...data } = req.body;
        const fecha_inicio = new Date(data.fechaInicio.concat("T", data.horaInicio));
        const fecha_fin = new Date(data.fechaFin.concat("T", data.horaFin));
        const body = {
            ...data,
            fundacion: req.usuario.id,
            fecha_inicio,
            fecha_fin
        };
        const convocatoriaDB = new Convocatoria(body);
        //Aumentar la cantidad de convocatorias de la fundacion
        await Fundacion.findByIdAndUpdate(req.usuario.id, { $inc: { convocatorias_realizadas: 1 } });
        //Crear aplicacionFundacion
        await postContadoresConvocatoriaPrimeraVez(convocatoriaDB._id);
        //Guardar en BD
        await convocatoriaDB.save();
        return res.json({ msg: 'Convocatoria creada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Fundacion
const putConvocatoria = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        //Verificar si la convocatoria es de la fundacion que esta intentado acceder
        const convocatoriaPropia = await esConvocatoriaDeLaFundacion(id, req.usuario.id);
        if (!convocatoriaPropia) return res.status(401).json({ msg: 'No tiene permiso para editar esta convocatoria' });
        //Actualizar convocatoria
        const { _id, fundacion, estado, ...data } = req.body;
        const fecha_inicio = new Date(data.fechaInicio.concat("T", data.horaInicio));
        const fecha_fin = new Date(data.fechaFin.concat("T", data.horaFin));
        const body = {
            ...data,
            fecha_inicio,
            fecha_fin
        };
        await Convocatoria.findByIdAndUpdate(id, body);
        return res.json({ msg: 'Convocatoria modificada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

//Fundacion
const deleteConvocatoria = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        //Verificar si la convocatoria es de la fundacion que esta intentado acceder
        const convocatoriaPropia = await esConvocatoriaDeLaFundacion(id, req.usuario.id);
        if (!convocatoriaPropia) return res.status(401).json({ msg: 'No tiene permiso para eliminar esta convocatoria' });
        //Eliminar convocatoria
        await Convocatoria.findByIdAndDelete(id);
        await ContadoresConvocatoria.findOneAndDelete({ convocatoria: id });
        return res.json({ msg: 'Convocatoria eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

module.exports = {
    getConvocatorias,
    getConvocatoriasCerradas,
    getConvocatoriasLugar,
    getConvocatoriasActivas,
    getAllConvocatorias,
    getConvocatoriaNombre,
    postConvocatoria,
    putConvocatoria,
    deleteConvocatoria
};