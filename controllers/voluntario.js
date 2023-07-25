const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const UIploadModel = require('../models/voluntario');
const { eliminarFile } = require('../helpers/configByFireBase');


const getVoluntarioById = async (req = request, res = response) => {
  try {

      const query = { _id: req.usuario.id };

      const voluntario = await UIploadModel.findById(query);
  
      return res.json({ voluntario });
  } catch (error) {
      res.status(500).json({ msg: error });
  }
}



const postFile = async (req = request, res = response) => {
  try {
    const { nombre, correo, password, telefono, direccion, CV, DPI, antecedentes, fotoPerfil, fotoFondo} = req.body;
    const rol= "VOLUNTARIO_ROLE";
  
    console.log("foto Perfil",fotoPerfil);
    console.log("foto fondo",fotoPerfil);
    if (correo ==='') {
      
      return res.status(400).json({
        msg: 'Agregue su correo por favor'
      });
       
    }
    if (nombre ==='') {
      
      return res.status(400).json({
        msg: 'Agregue su nombre por favor'
      });
       
    }
    if (password ==='') {
      
      return res.status(400).json({
        msg: 'Agregue su password por favor'
      });
       
    }
    if (CV ==='') {
      
      return res.status(400).json({
        msg: 'Agregue su CV por favor'
      });
       
    }
    if (DPI ==='') {
      
      return res.status(400).json({
        msg: 'Agregue su DPI por favor'
      });
    }

    if (antecedentes ==='') {
      
      return res.status(400).json({
        msg: 'Agregue sus antecedentes por por favor'
      });
    }
    if (fotoPerfil ==='') {
      
      return res.status(400).json({
        msg: 'Agregue ssu foto de perfil por por favor'
      });
    }
    if (fotoFondo ==='') {
      
      return res.status(400).json({
        msg: 'Agregue su foto de fondo por por favor'
      });
    }
   
 
    const existeEmail = await UIploadModel.findOne({ correo });

    if (existeEmail) {
     
      return res.status(400).json({
        msg:  `El correo ${correo} ya esta registrado`
      });
    }

    const voluntarioGuardado = new UIploadModel(
        { nombre, 
          correo, 
          password, 
          telefono, 
          direccion, 
          rol, 
          CV, 
          DPI, 
          antecedentes,
          fotoPerfil,
          fotoFondo });
    const salt = bcrypt.genSaltSync();
    voluntarioGuardado.password = bcrypt.hashSync(password, salt)
    await voluntarioGuardado.save();
    return res.json({
      msg: 'Post Voluntario user',
      voluntarioGuardado
  });
  } catch (err) {
    console.log(err);
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
    const { id } = req.params;
    const { nombre, correo, password, telefono, direccion, CV, DPI, antecedentes, fotoPerfil, fotoFondo} = req.body;
    const rol= "VOLUNTARIO_ROLE";
    
    console.log("perfil",fotoPerfil);
    console.log("fotoFondo",fotoFondo);
  
  const Voluntario = await UIploadModel.findById(id)
  let fileCv = Voluntario.CV;
  let fileDpi = Voluntario.DPI;
  let fileAtc = Voluntario.antecedentes;
  let photoPerfil = Voluntario.fotoPerfil;
  let photoFondo = Voluntario.fotoFondo;
  
  if (CV!=='') {
    console.log("es diferente CV");
    eliminarFile(fileCv);
    fileCv=CV
  }
  if (DPI!=='') {
    console.log("es diferente dpi");
    eliminarFile(fileDpi);
    fileDpi=DPI
  }
  if (antecedentes!=='') {
    console.log("es diferente antc");
    eliminarFile(fileAtc);
    fileAtc=antecedentes
  }
  if (fotoPerfil!=='') {
    console.log("es diferente fotop");
    eliminarFile(photoPerfil);
    photoPerfil=fotoPerfil
  }
  if(fotoFondo!==''){
    console.log("es diferente fotof");
    eliminarFile(photoFondo);
    photoFondo=fotoFondo
  }

  const datos = {
    nombre,
    correo, 
    password, 
    telefono, 
    direccion, 
    rol, 
    CV:fileCv,
    DPI:fileDpi,
    antecedentes:fileAtc,
    fotoPerfil:photoPerfil,
    fotoFondo:photoFondo
  }
 
  const voluntariadoEditado = await UIploadModel.findByIdAndUpdate(id, datos,{new:true});
  return res.json({
    msg: 'PUT editar user',
    voluntariadoEditado
});

} catch (err) {
  console.log(err);
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
    const { CV, DPI, antecedentes,fotoFondo,fotoPerfil } = voluntario;
    const arreglo =[CV, DPI, antecedentes,fotoFondo,fotoPerfil]
    
    for (let x = 0; x < arreglo.length; x++) {
      const element = arreglo[x];
      eliminarFile(element);
    }
    const voluntarioEliminado = await UIploadModel.findByIdAndDelete(id);

    res.status(201).json({ msg: 'Voluntario borrado: ' ,voluntarioEliminado});
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo eliminar el evento",
      err,
    });
  }
}
const getVoluntarioNombre = async (req = request, res = response) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;
    const regexNombre = new RegExp(req.params.nombre, "i");
    const [voluntarios, totalVoluntarios] = await Promise.all([
      UIploadModel.find({ nombre: regexNombre }, "nombre correo")
        .skip(desde)
        .limit(limite),
      UIploadModel.find({ nombre: regexNombre }).countDocuments(),
    ]);
    return res.json({ voluntarios, totalVoluntarios });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const contarVoluntarios = async (req = request, res = response) => {
  try {
    cantidadVoluntarios = await UIploadModel.countDocuments();
    return res.json({ cantidadVoluntarios });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  postFile,
  getFile,
  putFile,
  deleteFile,
  getFileArchivo,
  getVoluntarioById,
  contarVoluntarios,
  getVoluntarioNombre
};
