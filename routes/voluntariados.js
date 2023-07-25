const { Router } = require('express');
const { check } = require('express-validator');
const { getVoluntariadosActivos, postVoluntariados, putVoluntariados, deleteVoluntariados, contarVoluntariados,postVoluntariadosConvo } = require('../controllers/voluntariados');
const { validarJWT }  = require('../middlewares/validar-jwt');
const router = Router();

router.get('/', [
    validarJWT
], getVoluntariadosActivos);

router.post('/agregar', [
    
] ,postVoluntariados);

router.post('/cerrarConvo', [
    
] ,postVoluntariadosConvo);

router.put('/editar/:id', [
    
] ,putVoluntariados);


router.delete('/eliminar/:id', [
    
] ,deleteVoluntariados);

router.get('/contar', [
] ,contarVoluntariados );

module.exports = router;