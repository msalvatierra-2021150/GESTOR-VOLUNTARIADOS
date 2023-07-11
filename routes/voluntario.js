//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const express = require('express');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { getVoluntarioNombre,postFile,getFile,putFile,deleteFile, getFileArchivo,ruta, contarVoluntarios} = require('../controllers/voluntario');
const uploadMiddleware = require('../middlewares/MulterMiddlewares');
const router = Router();
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
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
//router.use('/files', express.static(path.join(publicFolderPath, 'archivos')));

router.get("/fileVoluntario/:nombre", getFileArchivo);

router.get("/voluntario", getFile);

router.post("/save",[
    uploadMiddleware.array("photo"),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    validarCampos,
],postFile);

router.put('/editar/:id', uploadMiddleware.array("photo") ,putFile);

router.delete('/eliminar/:id', [
] ,deleteFile);

router.get('/contar', [
] , contarVoluntarios);

module.exports = router;