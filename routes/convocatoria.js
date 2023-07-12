//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getConvocatorias, getConvocatoriasCerradas, getConvocatoriasLugar, getConvocatoriasActivas, getAllConvocatorias, getConvocatoriaNombre, postConvocatoria, putConvocatoria, deleteConvocatoria } = require('../controllers/convocatoria');
const { emailExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole, esAdminFundacionRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();

//Obtener una convocatoria por nombre
router.get('/buscar/:nombre', [
    validarJWT,
    esAdminAppRole
], getConvocatoriaNombre);

//Obtener todas las convocatorias activas de una fundación
router.get('/mostrar', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
], getConvocatorias);

//Obtener todas las convocatorias cerradas de una fundación
router.get('/mostrar-cerradas', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
], getConvocatoriasCerradas);

//Obtener todas las convocatorias segun un lugar
router.get('/mostrar-lugar/:lugar?/:titulo', [
    validarJWT,
    validarCampos
], getConvocatoriasLugar);

//Obtener todas las convocatorias activas
router.get('/mostrar-activas', [
    //validarJWT,
    validarCampos
], getConvocatoriasActivas);

//Obtener todas las convocatorias de las fundaciones
router.get('/mostrar-all', [
    validarJWT,
    tieneRole('ADMIN_APP', 'ADMIN_FUNDACION'),
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