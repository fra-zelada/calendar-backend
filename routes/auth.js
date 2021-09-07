/*
    Rutas de usuarios / auth
    host + /api/auth
*/ 

const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();
//const express = require('express');
//const router = express.Router


// rutas
// app.get('/', (req, res)=> {

//     console.log('se requiere /');
//     res.json({
//         ok: true
//     })
// })

router.post(
    '/new',
    [//middleware
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    crearUsuario)

router.post(
    '/',
    [
        check('email','formato de email incorrecto').isEmail(),
        check('password','Password debe ser minimo 6 caracteres').isLength({min: 6}),
        validarCampos
    ],
    loginUsuario)

router.get('/renew', validarJWT,  revalidarToken)

module.exports = router;