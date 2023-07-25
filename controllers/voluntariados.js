const { request, response } = require('express');
const Voluntariados = require('../models/voluntariados');
const express = require('express');
const Convocatoria = require('../models/convocatoria');
const convocatoria = require('../models/convocatoria');

const getVoluntariadosActivos = async (req = request, res = response) => {
    try {   
            
            const desde = Number(req.query.desde) || 0;
            const limite = Number(req.query.limite) || 10;
            const _id = req.usuario.id;
            const listaConvocatorias = await Convocatoria.find({ fundacion: _id });
            let coincidencias = [];
          
            for (let index = 0; index < listaConvocatorias.length; index++) {
              const convocatoriaID = listaConvocatorias[index].id;
              const voluntariado = await Voluntariados.findOne({ estado: true, convocatoria_voluntariado: convocatoriaID }).populate('convocatoria_voluntariado', 'titulo');
                if (voluntariado!==null) {
                    coincidencias.push(voluntariado);
                }
             
            }
            coincidencias = coincidencias.slice(desde, desde + limite)
            const totalCoincidencias = coincidencias.length;
       
        return res.json({
            coincidencias,
            totalCoincidencias
        });
    } catch (error) {
        return res.status(500).json({ msg: error });
    }
}
const postVoluntariados = async (req = request, res = response) => {
    try {
        const {
            convocatoria_voluntariado,
            voluntario,
            estado,
            fechaHoraStart,
            fechaHoraEnd,
            horaInicio,
            horaFinal } = req.body;

        const fechaHoraInicio = new Date(fechaHoraStart.concat('T', horaInicio));
        const fechaHoraFin = new Date(fechaHoraEnd.concat('T', horaFinal));


        // Generar la data a guardar
        const data = {
            convocatoria_voluntariado,
            voluntario,
            estado,
            fechaHoraInicio,
            fechaHoraFin
        }

        const voluntariadosDb = new Voluntariados(data);
        //Guardar en DB
        await voluntariadosDb.save();

        res.status(201).json(voluntariadosDb);
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo guardar el Evento",
            err,
        });
    }

}
const postVoluntariadosConvo = async (req = request, res = response) => {
    try {
        const {
            convocatoria_voluntariado,
            voluntarios,
            estado,
            fechaHoraInicio,
            fechaHoraFin,
        } = req.body;
            
        // Generar la data a guardar
        const data = {
            convocatoria_voluntariado,
            voluntarios,
            estado,
            fechaHoraInicio,
            fechaHoraFin
        }
        console.log(data);
        const cambiarEstado = await convocatoria.findByIdAndUpdate(convocatoria_voluntariado, {estado:false})
        const voluntariadosDb = new Voluntariados(data);

        //Guardar en DB
        await voluntariadosDb.save();

        res.status(201).json(voluntariadosDb);
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo guardar el Evento",
            err,
        });
    }

}
const putVoluntariados = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { convocatoria_voluntariado,
            voluntario,
            estado,
            fechaHoraStart,
            fechaHoraEnd,
            horaInicio,
            horaFinal } = req.body;
        const fechaHoraInicio = new Date(fechaHoraStart.concat('T', horaInicio)).toISOString();
        const fechaHoraFin = new Date(fechaHoraEnd.concat('T', horaFinal)).toISOString();
        
        console.log(convocatoria_voluntariado);
        console.log(voluntario);
        console.log(estado);
        console.log(fechaHoraInicio);
        console.log(fechaHoraFin);
        
        const datos = {
            convocatoria_voluntariado,
            voluntario,
            estado,
            fechaHoraInicio,
            fechaHoraFin,
        }
        const voluntariadoEditar = await Voluntariados.findByIdAndUpdate(id,datos)
        console.log(voluntariadoEditar);
        res.status(201).json({ msg: 'Evento Editado: ', voluntariadoEditar });
    } catch (err) {
        console.log(err);
        res.status(404).send({
            msg: "No se pudo editar el voluntariado",
            err,
        });
    }
}
const deleteVoluntariados = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        //Editar o actualiar la cateogira: Estado FALSE
        const voluntariadosDb = await Voluntariados.findByIdAndDelete(id);

        res.status(201).json({ msg: 'Rol borrado: ', voluntariadosDb });
    } catch (err) {
        res.status(404).send({
            msg: "No se pudo eliminar el evento",
            err,
        });
    }
}

const contarVoluntariados = async (req = request, res = response) => {
    try {
        cantidadVoluntariados = await Voluntariados.countDocuments();
        return res.json({cantidadVoluntariados });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}
module.exports = {
    getVoluntariadosActivos,
    deleteVoluntariados,
    postVoluntariados,
    putVoluntariados,
    contarVoluntariados,
    postVoluntariadosConvo
}