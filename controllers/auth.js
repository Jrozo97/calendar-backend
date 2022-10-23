const { response } = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User-Model');
const { generateJWT } = require('../helpers/jwt');



const createUser = async (req, res = response) => {

    const { email, password } = req.body

    try {

        let user = await UserModel.findOne({ email })

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }

        user = new UserModel(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();

        user.password = bcrypt.hashSync( password, salt )

        await user.save();

        //Generar JWT
        const token = await generateJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}

const loginUser = async(req, res = response) => {

    const { email, password } = req.body


    try {
        
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }
        //confirmar los passwords

        const validPassword =  bcrypt.compareSync(password, user.password);

        if( !validPassword ){
            return res.status(400).json({
                ok:false,
                msg: 'Password incorrecto'
            })
        }

        //Generar nuestro JWT
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
        

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })        
    }

}

const renewToken = async(req, res = response) => {

    const { uid, name } = req;

    //Generar JWT
    const token = await generateJWT( uid,   name );

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}


module.exports = {
    createUser,
    loginUser,
    renewToken
}