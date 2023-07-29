const { response, request } = require("express");
//Importar Modelos
const Convocatoria = require("../models/convocatoria");
const Fundacion = require("../models/adminFundacion");
const ContadoresConvocatoria = require("../models/contadoresConvocatoria");
//Creacion de los contadores de la convocatoria
const {
  postContadoresConvocatoriaPrimeraVez,
} = require("../controllers/contadoresConvocatoria");
//Evaluar si la convocatoria es de la fundacion que esta intentado acceder
const { esConvocatoriaDeLaFundacion } = require("../helpers/db-validators");
//Fundacion
const path = require("path");
const fs = require("fs");
const { eliminarFile } = require("../helpers/configByFireBase");

const getConvocatorias = async (req = request, res = response) => {
  try {
    const query = { fundacion: req.usuario.id, estado: true };
    const convocatorias = await Convocatoria.find(query);
    return res.json({ convocatorias });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getConvocatoriasById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const convocatorias = await Convocatoria.findById(id);
    return res.json({ convocatorias });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

//Fundacion
const getConvocatoriasCerradas = async (req = request, res = response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const query = { fundacion: req.usuario.id, estado: false };
    const [convocatorias, totalConvocatoria] = await Promise.all([
      Convocatoria.find(query).skip(desde).limit(limite).populate({
        path: "fundacion",
        select: "nombre fotoPerfil",
      }),
      Convocatoria.countDocuments(query),
    ]);
    return res.json({ convocatorias, totalConvocatoria });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

//Voluntario
const getConvocatoriasLugar = async (req = request, res = response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const regexTitulo = new RegExp(req.params.titulo, "i");
    let coincidencias = [];
    let registros = 0;
    if (req.params.lugar === null) {
      const [convocatorias, totalConvocatoria] = await Promise.all([
        Convocatoria.find({
          $and: [{ titulo: regexTitulo }, { estado: true }],
        })
          .skip(desde)
          .limit(limite)
          .populate({
            path: "fundacion",
            select: "nombre fotoPerfil",
          }),
        Convocatoria.countDocuments({
          $and: [{ titulo: regexTitulo }, { estado: true }],
        }),
      ]);
      coincidencias = convocatorias;
      registros = totalConvocatoria;
    } else {
      const regexLugar = new RegExp(req.params.lugar, "i");
      const [convocatorias, totalConvocatoria] = await Promise.all([
        Convocatoria.find({
          $and: [
            { lugar: regexLugar },
            { titulo: regexTitulo },
            { estado: true },
          ],
        })
          .skip(desde)
          .limit(limite)
          .populate({
            path: "fundacion",
            select: "nombre fotoPerfil",
          }),
        Convocatoria.countDocuments({
          $and: [
            { lugar: regexLugar },
            { titulo: regexTitulo },
            { estado: true },
          ],
        }),
      ]);
      coincidencias = convocatorias;
      registros = totalConvocatoria;
    }
    return res.json({ coincidencias, registros });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

//Voluntario
const getConvocatoriasActivas = async (req = request, res = response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const query = { estado: true };
    const [coincidencias, registros] = await Promise.all([
      Convocatoria.find(query).skip(desde).limit(limite).populate({
        path: "fundacion",
        select: "nombre fotoPerfil",
      }),
      Convocatoria.countDocuments(query),
    ]);
    return res.json({ coincidencias, registros });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

//Admin y Fundacion
const getAllConvocatorias = async (req = request, res = response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const query = { fundacion: req.usuario.id, estado: true };
    const [convocatorias, totalConvocatoria] = await Promise.all([
      Convocatoria.find(query).skip(desde).limit(limite).populate({
        path: "fundacion",
        select: "nombre fotoPerfil",
      }),
      Convocatoria.countDocuments(),
    ]);
    return res.json({ convocatorias, totalConvocatoria });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const postConvocatoria = async (req = request, res = response) => {
    
  try {
      
      const { titulo,descripcion,lugar,cupo,fechaHoraStart,fechaHoraEnd,horaInicio,horaFinal,imagen } = req.body;
      
      if(imagen === ''){
          return res.status(400).json({
              msg: 'Agregue su foto por favor'
            });
      } 
      if (titulo ==='') {
          eliminarFile(imagen)
          return res.status(400).json({
              msg: 'Agregue su nombre de fundacion por favor'
            });
      }
      if (descripcion ==='') {
          eliminarFile(imagen);     
          return res.status(400).json({
              msg: 'Agregue descripcion por favor'
            });
      }
      if (lugar ==='') {
          eliminarFile(imagen)
              return res.status(400).json({
              msg: 'Agregue su lugar por favor'
            });
      }
      
      
      const fecha_inicio = new Date(fechaHoraStart.concat("T", horaInicio));
      const fecha_fin = new Date(fechaHoraEnd.concat("T", horaFinal));


      const body = {
          titulo,
          descripcion,
          lugar,
          cupo,
          fundacion: req.usuario.id,
          fecha_inicio,
          fecha_fin,
          imagen
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
      const { titulo,descripcion,lugar,cupo,fechaHoraStart,fechaHoraEnd,horaInicio,horaFinal,imagen } = req.body;
      const convocatoriaEdi = await Convocatoria.findById(id)
      let imagenFile = convocatoriaEdi.imagen

      if (imagen!=='' ) {
          console.log("es diferente imagen");
          eliminarFile(imagenFile);
          imagenFile=imagen
      }
      //Verificar si la convocatoria es de la fundacion que esta intentado acceder
      const convocatoriaPropia = await esConvocatoriaDeLaFundacion(id, req.usuario.id);
      if (!convocatoriaPropia){
         eliminarFile(imagen)
          return res.status(401).json({ msg: 'No tiene permiso para editar esta convocatoria' });
      }
      const fecha_inicio = new Date(fechaHoraStart.concat("T", horaInicio));
      const fecha_fin = new Date(fechaHoraEnd.concat("T", horaFinal));
   
      const body = {
          titulo,
          descripcion,
          lugar,
          cupo,
          fecha_inicio,
          fecha_fin,
          imagen:imagenFile
      };
      await Convocatoria.findByIdAndUpdate(id, body);
      return res.json({ msg: 'Convocatoria modificada correctamente' });
  } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error });
  }
}

const deleteConvocatoria = async (req = request, res = response) => {
  try {
      const { id } = req.params;
      //Verificar si la convocatoria es de la fundacion que esta intentado acceder
      const convocatoriaPropia = await esConvocatoriaDeLaFundacion(id, req.usuario.id);
      if (!convocatoriaPropia) return res.status(401).json({ msg: 'No tiene permiso para eliminar esta convocatoria' });
      //Eliminar convocatoria
      const convocatoria = await Convocatoria.findById(id);
      eliminarFile(convocatoria.imagen);
      await Convocatoria.findByIdAndDelete(id);
      await ContadoresConvocatoria.findOneAndDelete({ convocatoria: id });
      return res.json({ msg: 'Convocatoria eliminada correctamente' });
  } catch (error) {
      res.status(500).json({ msg: error });
  }
}
//Admin
const getConvocatoriaNombre = async (req = request, res = response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    const regexNombre = new RegExp(req.params.nombre, "i");
    const [convocatorias, totalConvocatoria] = await Promise.all([
      Convocatoria.find(
        { titulo: regexNombre },
        "titulo lugar fecha_inicio fecha_fin cupo"
      )
        .skip(desde)
        .limit(limite)
        .populate({
          path: "fundacion",
          select: "nombre fotoPerfil",
        }),
      Convocatoria.countDocuments({ titulo: regexNombre }),
    ]);
    return res.json({ convocatorias, totalConvocatoria });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
//Fundacion

const contarConvocatoria = async (req = request, res = response) => {
  try {
    cantidadConvocatorias = await Convocatoria.countDocuments();
    return res.json({ cantidadConvocatorias });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getConvocatorias,
  getConvocatoriasCerradas,
  getConvocatoriasLugar,
  getConvocatoriasActivas,
  getAllConvocatorias,
  getConvocatoriaNombre,
  postConvocatoria,
  putConvocatoria,
  deleteConvocatoria,
  contarConvocatoria,
  getConvocatoriasById,
};
