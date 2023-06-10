//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAdminFundacion, getAllAdminsFundaciones, postAdminFundacion, putAdminFundacion, deleteAdminFundacion } = require('../controllers/adminFundacion');
const { emailExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminFundacionRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar',[
    validarJWT,
    esAdminFundacionRole
] ,getAdminFundacion);

router.get('/mostrar-all',[
    validarJWT
] ,getAllAdminsFundaciones);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    validarCampos,
] ,postAdminFundacion);

router.put('/editar', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
] ,putAdminFundacion);


router.delete('/eliminar', [
    validarJWT,
    esAdminFundacionRole,
    validarCampos
] ,deleteAdminFundacion);

// ROUTER
module.exports = router;