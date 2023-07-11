//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getConvocatorias, getAllConvocatorias,getConvocatoriasById, postConvocatoria, putConvocatoria, deleteConvocatoria } = require('../controllers/convocatoria');
const { emailExiste} = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole, esAdminFundacionRole } = require('../middlewares/validar-roles');
const uploadMiddleware = require('../middlewares/MulterMiddlewares');
const router = Router();

//Obtener todas las convocatorias de una fundación
router.get('/mostrar', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
], getConvocatorias);
//mostrar por id
router.get('/mostrarById/:id', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
], getConvocatoriasById);
//Obtener todas las convocatorias de las fundaciones
router.get('/mostrar-all', [
    validarJWT,
    esAdminAppRole,
    validarCampos
], getAllConvocatorias);

//Crear una convocatoria
router.post('/agregar', [
    validarJWT,
    uploadMiddleware.fields([
        { name: 'imagen', maxCount: 1 }]),
    esAdminFundacionRole,
    validarCampos
], postConvocatoria);

//Editar una convocatoria
router.put('/editar/:id', [
    validarJWT,
    uploadMiddleware.fields([
        { name: 'imagen', maxCount: 1 }]),
    esAdminFundacionRole,
    validarCampos
], putConvocatoria);

//Eliminar una convocatoria
router.delete('/eliminar/:id', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
], deleteConvocatoria);

// ROUTER
module.exports = router;