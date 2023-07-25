//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const express = require('express');
const { esRoleValido, emailExiste, existeUsuarioPorId, requiredFilesMiddleware } = require('../helpers/db-validators');
const {postFile,getFile,putFile,deleteFile, getFileArchivo,ruta,getVoluntarioById, contarVoluntarios, getVoluntarioNombre} = require('../controllers/voluntario');
const uploadMiddleware = require('../middlewares/MulterMiddlewares');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { esAdminAppRole } = require('../middlewares/validar-roles');
const path = require('path');


const publicFolderPath = path.join(__dirname, 'public');

router.get('/buscar/:nombre',[
    validarJWT,
    esAdminAppRole
],getVoluntarioNombre);

router.use('/archivos', express.static(path.join(publicFolderPath, 'archivos')));

router.use('/archivos', (req, res, next) => {
    console.log('La ruta de los archivos estáticos es:', path.join(publicFolderPath, 'archivos'));
    next();
  });

router.get("/fileVoluntario/:nombre", getFileArchivo);

router.get("/voluntario", getFile);

router.get("/voluntarioById",[
    validarJWT,validarCampos] ,getVoluntarioById);

router.post("/save",postFile);

router.put('/editar/:id',putFile);

router.delete('/eliminar/:id', [
] ,deleteFile);

router.get('/contar', [
] , contarVoluntarios);


module.exports = router;