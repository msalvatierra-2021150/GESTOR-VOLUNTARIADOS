const { response, request } = require("express");
const bcrypt = require("bcryptjs");
//Importación de l modelo
const path = require("path");
const adminApp = require("../models/adminApp");
const adminFundacion = require("../models/adminFundacion");
const voluntariados = require("../models/voluntariados");
const convocatoria = require("../models/convocatoria");
const aplicacionVoluntariado = require("../models/aplicacionVoluntariado");
const fs = require("fs");
const { eliminarFile } = require("../helpers/configByFireBase");

const getAdmin = async (req = request, res = response) => {
  try {
    const { id } = req.usuario;

    const adminapp = await adminApp.findById(id);
    console.log(adminapp);
    return res.json({
      msg: "get Api - Controlador Admin",
      adminapp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const eliminarUpdate = (nombre) => {
  const cvFilePath = path.resolve("public/archivos", nombre);
  fs.unlink(cvFilePath, (error) => {});
};

const getVolunrariados = async (req = request, res = response) => {
  try {
    const query = { estado: true };
    const listaVoluntariados = await voluntariados.count(query);

    res.json({
      msg: "get Api - Controlador Voluntariados",
      listaVoluntariados,
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo listar el Evento",
      err,
    });
  }
};
const getConvocatorias = async (req = request, res = response) => {
  try {
    const query = { estado: true };
    const listaConvocatoria = await convocatoria.count(query);

    res.json({
      msg: "get Api - Controlador Convocatoria",
      listaConvocatoria,
    });
  } catch (err) {
    res.status(404).send({
      msg: "No se pudo listar el Evento",
      err,
    });
  }
};
//get cantidad de fundaciones
const getAdminFundaciones = async (req = request, res = response) => {
  try {
    const cantidadFundacion = await adminFundacion.count();

    return res.json({
      msg: "get Api - Controlador Admin",
      cantidadFundacion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAplicacionFundacion = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const convocatorias = await convocatoria.find({ fundacion: id });
    let cantidad = 0;
    for (let x = 0; x < convocatorias.length; x++) {
      const element = convocatorias[x]._id;

      const aplicaciones = await aplicacionVoluntariado.find({
        convocatoria: element.toString(),
      });

      cantidad = aplicaciones.length;
    }

    return res.json({
      msg: "get Api - Cantidad de aplicaciones",
      cantidad,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const postAdmin = async (req = request, res = response) => {
  //Desestructuración
  const { nombre, correo, password ,fotoPerfil, fotoFondo} = req.body;
  const rol = req.body.rol || "ADMIN_APP";
 
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
if (nombre === '') {
  eliminarFile(fotoFondo);
  eliminarFile(fotoPerfil);
  return res.status(400).json({
      msg: 'Agregue su nombre por favor'
  });
}
const existeEmail = await adminApp.findOne({ correo });
if (existeEmail) {

  return res.status(400).json({
      msg: `El correo ${correo} ya esta registrado`
  });
}
  const adminAppGuardadoDB = new adminApp({
    nombre,
    correo,
    password,
    rol,
    fotoPerfil,
    fotoFondo,
  });

  //Encriptar password
  const salt = bcrypt.genSaltSync();
  adminAppGuardadoDB.password = bcrypt.hashSync(password, salt);

  //Guardar en BD
  await adminAppGuardadoDB.save();

  res.json({
    msg: "Post Api - Post Admin",
    adminAppGuardadoDB,
  });
};

const putAdmin = async (req = request, res = response) => {
  //Req.params sirve para traer parametros de las rutas
  const id = req.usuario.id;

  const { nombre, correo, password ,fotoPerfil, fotoFondo} = req.body;
  console.log(fotoPerfil);
  console.log(fotoFondo);
  //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)
  //Si la password existe o viene en el req.body, la encripta
  const adminFiles= await adminApp.findById(id);
  let fileFotoP = adminFiles.fotoPerfil;
  let fileFotoF = adminFiles.fotoFondo;
  if (fotoPerfil !== '') {
           
    eliminarFile(fileFotoP);
    fileFotoP = fotoPerfil
}
if (fotoFondo !== '') {
            
  eliminarFile(fileFotoF);
  fileFotoF = fotoFondo
}
  const datos = {
    nombre,
    correo,
    password,
    fotoPerfil: fileFotoP,
    fotoFondo: fileFotoF,
  };

  const adminAppEditado = await adminApp.findByIdAndUpdate(id, datos);
  return res.json({
    msg: "PUT editar Admin",
    usuarioEditado: adminAppEditado,
  });
};
 
const deleteAdmin = async (req = request, res = response) => {
  //Req.params sirve para traer parametros de las rutas
  const { id } = req.usuario;
  const admin = await adminApp.findById(id);

  const { fotoFondo, fotoPerfil } = admin;
  //Eliminar cambiando el estado a false
  const adminAppEliminado = await adminApp.findByIdAndDelete(id);
  const arreglo = [fotoFondo, fotoPerfil];

  for (let x = 0; x < arreglo.length; x++) {
    const element = arreglo[x];

    eliminarFile(element);
  }

  return res.json({
    msg: "DELETE eliminar AdminApp",
    adminAppEliminado,
  });
};

const deleteFundacion = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    await adminFundacion.findByIdAndDelete(id);
    return res.json({ msg: "Fundación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAdmin,
  postAdmin,
  putAdmin,
  deleteAdmin,
  getAdminFundaciones,
  deleteFundacion,
  getVolunrariados,
  getConvocatorias,
  getAplicacionFundacion,
};

// CONTROLADOR
