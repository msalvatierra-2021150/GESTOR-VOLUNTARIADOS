const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const UIploadModel = require('../models/voluntario');
const fs = require('fs');
const uploadMiddleware = require('../middlewares/MulterMiddlewares');

const getVoluntarioNombre = async (req = request, res = response) => {
  try {
    const regexNombre = new RegExp(req.params.nombre, 'i');
    const voluntario = await UIploadModel.find({
      $and: [
        { nombre: regexNombre },
        { estado: true }
      ]
    });
    return res.json({ voluntario });
  } catch (error) {
    res.status(500).json({ msg: error })
    
  }
}

const postFile = async (req = request, res = response) => {
  try {
    const photo = req.files.map(file => file.filename);
    const { nombre, correo, password, telefono, direccion, rol, array_img, array_historial_voluntariados } = req.body;
    const CV = photo[0]
    const DPI = photo[1]
    const antecedentes = photo[2]
    if (CV ===undefined) {
      return res.status(400).json({
        msg: 'Agregue su CV por favor'
      });
    }
    if (DPI ===undefined) {
      return res.status(400).json({
        msg: 'Agregue su DPI por favor'
      });
    }
    console.log(antecedentes);
    if (antecedentes ===undefined) {
      return res.status(400).json({
        msg: 'Agregue sus antecedentes por por favor'
      });
    }
    

    const existeEmail = await UIploadModel.findOne({ correo });

    if (existeEmail) {
      return res.status(400).json({
        msg:  `El correo ${correo} ya esta registrado`
      });
    }

    const pdfGuardadoDB = new UIploadModel({ nombre, correo, password, telefono, direccion, rol, array_img, array_historial_voluntariados, CV, DPI, antecedentes });
    const salt = bcrypt.genSaltSync();
    pdfGuardadoDB.password = bcrypt.hashSync(password, salt)
    await pdfGuardadoDB.save();
  } catch (err) {
    return res.status(400).send({
      msg: "No se pudo agregar el cliente",
      err,
    });
  }
}
//get de voluntarios
const getFile = async (req = request, res = response) => {
  try {

    const voluntario = await UIploadModel.find()

    res.json({
      msg: 'get Api - Controlador Ecvento',
      voluntario
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo listar el Evento",
      err,
    });
  }
}
//get de sus archivos para descargar
const getFileArchivo = async (req = request, res = response) => {
  try {
    const { nombre } = req.params;
    const fileUrl = `${req.protocol}://${req.get('host')}/archivos/${nombre}`;
    console.log(fileUrl);
    res.json({ fileUrl });
  } catch (err) {
    res.status(404).send({
      msg: 'Error al obtener el archivo',
      error: err,
    });
  }
}
const putFile = async (req = request, res = response) => {
  try {
  const photo = req.files.map(file => file.filename);
  const { id, nombre, correo, password, telefono, direccion, rol, array_img, array_historial_voluntariados } = req.body;
  
  
  let CVArchivo = photo[0]
  let DPIArchivo = photo[1]
  let antecedentesArchivo = photo[2]
  const { CV, DPI, antecedentes } = await UIploadModel.findById(id)
  console.log(CVArchivo);
  console.log(DPIArchivo);
  console.log(antecedentesArchivo);

  console.log(CV);
  console.log(DPI);
  console.log(antecedentes);
  if (CVArchivo===undefined ) {
    CVArchivo=CV
    console.log("El nuevo CV:",CVArchivo);
  }else if(CVArchivo!==undefined){
    const cvFilePath = path.resolve('public/archivos', CV);
    fs.unlink(cvFilePath, (error) => {
      if (error) {
        console.error('Error al eliminar el archivo:', error);
      } else {
        console.log('Archivo eliminado CV');
      }
    });
  }
  if (DPIArchivo===undefined ) {
    DPIArchivo=DPI
    console.log("el nuevo DPI es ",DPIArchivo);
  }else if(DPIArchivo!==undefined){
    const dpiFilePath = path.resolve('public/archivos', DPI);
    fs.unlink(dpiFilePath, (error) => {
      if (error) {
        console.error('Error al eliminar el archivo:', error);
      } else {
        console.log('Archivo eliminado DPI');
      }
    });
  }
  if (antecedentesArchivo===undefined ) {
    antecedentesArchivo=antecedentes
    console.log("el nuevo antecedente es ",antecedentesArchivo);
  }else if(antecedentesArchivo!==undefined){
    const antecedentesFilePath = path.resolve('public/archivos', antecedentes);
    fs.unlink(antecedentesFilePath, (error) => {
      if (error) {
        console.error('Error al eliminar el archivo:', error);
      } else {
        console.log('Archivo eliminado ANTECEDENTE');
      }
    });
  }

  console.log("seguira",CVArchivo);
  console.log("seguira",DPIArchivo);
  console.log("seguira",antecedentesArchivo);
  const datos = {
    nombre,
    correo, 
    password, 
    telefono, 
    direccion, 
    rol, 
    array_img, 
    array_historial_voluntariados,
    CV:CVArchivo,
    DPI:DPIArchivo,
    antecedentes:antecedentesArchivo
  }
  console.log(datos);
  const voluntariadoEditado = await UIploadModel.findByIdAndUpdate(id, datos,{new:true});
  return res.json({
    msg: 'PUT editar user',
    voluntariadoEditado
});

} catch (err) {
  res.status(404).send({
      msg: "No se pudo editar el cliente",
      err,
    });
}

}
const deleteFile = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const voluntario = await UIploadModel.findById(id);
    const { CV, DPI, antecedentes } = voluntario;

    const cvFilePath = path.resolve('public/archivos', CV);
    const dpiFilePath = path.resolve('public/archivos', DPI);
    const antecedentesFilePath = path.resolve('public/archivos', antecedentes);
    const fileDb = await UIploadModel.findByIdAndDelete(id);
    const files = [cvFilePath, dpiFilePath, antecedentesFilePath]
    for (let x = 0; x < files.length; x++) {
      const element = files[x];
      fs.unlink(element, (error) => {
        if (error) {
          console.error('Error al eliminar el archivo:', error);
        } else {
          console.log('Archivo eliminado correctamente');
        }
      });
    }
    res.status(201).json({ msg: 'Rol borrado: ', fileDb });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo eliminar el evento",
      err,
    });
  }
}

const contarVoluntarios = async (req = request, res = response) => {
  try {
      cantidadVoluntarios = await UIploadModel.countDocuments();
      return res.json({cantidadVoluntarios });
  } catch (error) {
      res.status(500).json({ msg: error });
  }
}

module.exports = {
  getVoluntarioNombre,
  postFile,
  getFile,
  putFile,
  deleteFile,
  getFileArchivo,
  contarVoluntarios
}