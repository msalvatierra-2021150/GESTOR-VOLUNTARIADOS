//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAdminFundacion, getAllAdminsFundaciones, postAdminFundacion, putAdminFundacion, deleteAdminFundacion } = require('../controllers/adminFundacion');
const { emailExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminFundacionRole, esAdminAppRole } = require('../middlewares/validar-roles');
const uploadMiddleware = require('../middlewares/MulterMiddlewares');
const router = Router();
 
router.get('/mostrar',[
    validarJWT,
    esAdminFundacionRole
] ,getAdminFundacion);
 
router.get('/mostrar-all',[
    validarJWT,
    esAdminAppRole
] ,getAllAdminsFundaciones);

router.post('/agregar', [
    uploadMiddleware.fields([
        { name: 'fotoPerfil', maxCount: 1 },
        { name: 'fotoFondo', maxCount: 1 },]),
    check('correo').custom( emailExiste ),
    validarCampos,
] ,postAdminFundacion);

router.put('/editar', [
    validarJWT,
    uploadMiddleware.fields([
        { name: 'fotoPerfil', maxCount: 1 },
        { name: 'fotoFondo', maxCount: 1 },]),
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