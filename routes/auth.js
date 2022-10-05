/*
    Rutas de usuarios /auth

    host + /api/auth


*/

const { Router } = require("express");
const router = Router();
const { check } = require('express-validator');

const { createUser, loginUser, renewToken } = require("../controllers/auth");
const { fieldsValidators } = require("../middlewares/fields-validators");
const { validatorJWT } = require("../middlewares/vadilator-jwt");

router.post(
    "/new", 
    [ //middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        fieldsValidators

    ], 
    createUser);

router.post(
    "/",
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        fieldsValidators
    ],
    loginUser);

router.get("/renew", validatorJWT , renewToken);

module.exports = router;
