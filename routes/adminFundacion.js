//Importaciones
const { Router } = require('express');
const { getFundacionNombre, getAdminFundacion, getAllAdminsFundaciones, postAdminFundacion, putAdminFundacion, deleteAdminFundacion, contarFundaciones } = require('../controllers/adminFundacion');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminFundacionRole, esAdminAppRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/buscar/:nombre', getFundacionNombre);
 
router.get('/mostrar',[
    validarJWT,
    esAdminFundacionRole
] ,getAdminFundacion);

router.get('/mostrar-all',[
    validarJWT
] ,getAllAdminsFundaciones);

router.post('/agregar', [
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

router.get('/contar', [
] , contarFundaciones);

// ROUTER
module.exports = router;