/*
    Event Routes
    /api/events
*/


// Todas tienen que pasar por la validacion del JWT
// Obtener eventos

const { Router } = require("express");
const { check } = require("express-validator");
const { getEvents, createEvents, updateEvents, deleteEvents } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { fieldsValidators } = require("../middlewares/fields-validators");
const { validatorJWT } = require("../middlewares/vadilator-jwt");

const router = Router();

//Todas tienen que pasar por la validacion JWT
router.use( validatorJWT );

//Obtener evento
router.get('/', getEvents);

// Crear nuevo evento
router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        fieldsValidators
    ],
    createEvents)

// Actualizar evento
router.put('/:id', updateEvents)

//Borrar evento
router.delete('/:id', deleteEvents)

module.exports = router;