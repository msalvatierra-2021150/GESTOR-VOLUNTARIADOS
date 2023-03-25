const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole } = require('../middlewares/validar-roles');
const { existeRol, existeRolPorId } = require('../helpers/db-validators');

const { getRoles, postRoles, putRoles, deleteRoles } = require('../controllers/role');

const router = Router();
//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/mostrar', getRoles );

// Crear categoria - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    esAdminAppRole ,
    check('rol', 'El nombre es obligatorio').not().isEmpty(),
    check('rol').custom( existeRol ),
    validarCampos
] ,postRoles);

// Actuaizar categoria - privada - cualquier persona con un token válido
router.put('/editar/:id', [
    validarJWT,
    esAdminAppRole ,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeRolPorId ),
    check('rol', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,putRoles);

//Borrar una categoria - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:id', [
    validarJWT,
    esAdminAppRole ,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeRolPorId ),
    validarCampos
] ,deleteRoles);



module.exports = router;