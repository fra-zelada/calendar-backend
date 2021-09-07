const {response} = require('express');
//const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
//const express = require('express')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

     const { email, password} = req.body;

   try {
    
        let usuario = await Usuario.findOne({email: email})
        
        if(usuario)
        {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            })
        }
        usuario = new Usuario( req.body )

        //encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save();

        // GENERAR JWT
        const token = await generarJWT( usuario.id, usuario.name) ;

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
   } catch (error) {
    
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error en creación'
        })

   }


}


const loginUsuario = async (req, res = response)=> {

    const { email, password} = req.body;

    try {
        
        const usuario = await Usuario.findOne({email: email})
        
        if(!usuario)
        {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / contraseña incorrectos'
            })
        }

        //confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                mag: 'Password incorrecto'
            })
        }

        // GENERAR JWT
        const token = await generarJWT( usuario.id, usuario.name) ;
        
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error en login'
        })

    }

    
}

const revalidarToken = async(req, res = response)=> {

    const uid = req.uid;
    const name = req.name

    // GENERAR JWT
    const token = await generarJWT( uid, name ) ;

    res.json({
        ok: true,
        token
    })
}

//module.exports = crearUsuario
module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}