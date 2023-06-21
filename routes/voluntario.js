//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getVoluntarios, postVoluntario, putVoluntario, deleteVoluntario } = require('../controllers/voluntario');
const { emailExiste} = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { NoEsAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', [
    validarJWT,
    NoEsAdminRole
],getVoluntarios);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    validarCampos,
] ,postVoluntario);

router.put('/editar', [
    validarJWT,
    NoEsAdminRole,
    validarCampos
] ,putVoluntario);


router.delete('/eliminar', [
    validarJWT,
    NoEsAdminRole,
    validarCampos
] ,deleteVoluntario);


module.exports = router;