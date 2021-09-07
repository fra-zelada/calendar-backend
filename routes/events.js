/*
Event Routes
/api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt")
const router = Router();



//todo lo que está abajo de esta orden pasará por la validación de jwt
router.use(validarJWT)

//  Obtener eventos
router.get('/', getEventos)

// //crear un nuevo evento
router.post('/',[
                check('title','El título es obligatorio').not().isEmpty(),
                check('start','Fecha de inicio es obligatoria').custom(isDate),
                check('end','Fecha de finalización es obligatoria').custom(isDate),
                validarCampos], 
                crearEvento)

// //actualizar evento
router.put('/:id',[
    check('title','El título es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom(isDate),
    check('end','Fecha de finalización es obligatoria').custom(isDate),
    validarCampos], actualizarEvento)

// //Borrar Evento
router.delete('/:id', eliminarEvento)

module.exports = router