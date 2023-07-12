//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getContadoresConvocatoria } = require('../controllers/contadoresConvocatoria');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Obtener los contadores de una convocatoria
router.get('/mostrar/:id', [
    validarJWT,
    validarCampos
], getContadoresConvocatoria);

module.exports = router;