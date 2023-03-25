//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario } = require('../controllers/cliente');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, NoEsAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', [
    validarJWT,
    NoEsAdminRole
],getUsuarios);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    validarCampos,
] ,postUsuario);

router.put('/editar', [
    validarJWT,
    NoEsAdminRole,
    validarCampos
] ,putUsuario);


router.delete('/eliminar', [
    validarJWT,
    NoEsAdminRole,
    validarCampos
] ,deleteUsuario);


module.exports = router;


// ROUTES