//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getConvocatorias, getAllConvocatorias, postConvocatoria, putConvocatoria, deleteConvocatoria } = require('../controllers/convocatoria');
const { emailExiste} = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole, esAdminFundacionRole } = require('../middlewares/validar-roles');

const router = Router();

//Obtener todas las convocatorias de una fundación
router.get('/mostrar', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
], getConvocatorias);

//Obtener todas las convocatorias de las fundaciones
router.get('/mostrar-all', [
    validarJWT,
    esAdminAppRole,
    validarCampos
], getAllConvocatorias);

//Crear una convocatoria
router.post('/agregar', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
], postConvocatoria);

//Editar una convocatoria
router.put('/editar/:id', [
    validarJWT,
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