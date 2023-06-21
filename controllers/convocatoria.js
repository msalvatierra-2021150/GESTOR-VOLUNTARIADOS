const { response, request } = require('express');
//Importar Modelos
const Convocatoria = require('../models/convocatoria');
const Fundacion = require('../models/adminFundacion');
//Creacion de los contadores de la convocatoria
const { postContadoresConvocatoriaPrimeraVez } = require('../controllers/contadoresConvocatoria');
//Evaluar si la convocatoria es de la fundacion que esta intentado acceder
const { esConvocatoriaDeLaFundacion } = require('../helpers/db-validators');

const getConvocatorias = async (req = request, res = response) => {
    try {
        const query = { fundacion: req.usuario.id };
        const convocatorias = await Convocatoria.find(query);
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

const getAllConvocatorias = async (req = request, res = response) => {
    try {
        const convocatorias = await Convocatoria.find();
        return res.json({ convocatorias });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

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

const putConvocatoria = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        //Verificar si la convocatoria es de la fundacion que esta intentado acceder
        const convocatoriaPropia = await esConvocatoriaDeLaFundacion(id);
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

const deleteConvocatoria = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        //Verificar si la convocatoria es de la fundacion que esta intentado acceder
        const convocatoriaPropia = await esConvocatoriaDeLaFundacion(id);
        if (!convocatoriaPropia) return res.status(401).json({ msg: 'No tiene permiso para eliminar esta convocatoria' });
        //Eliminar convocatoria
        await Convocatoria.findByIdAndDelete(id);
        return res.json({ msg: 'Convocatoria eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

module.exports = {
    getConvocatorias,
    getAllConvocatorias,
    postConvocatoria,
    putConvocatoria,
    deleteConvocatoria
};
