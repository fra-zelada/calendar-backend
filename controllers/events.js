const { response, request } = require('express')
const Evento = require('../models/Evento')


const getEventos = async (req, res = response) => {



    try {
        const eventos = await Evento.find()
            .populate('user', 'name'); //'name password'
        res.status(200).json({
            ok: true,
            eventos
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los eventos'
        })
    }

}

const crearEvento = async (req = request, res = response) => {


    const evento = new Evento(req.body);



    try {

        //obtengo id desde el request (obtenido del token)
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            eventoGuardado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error al crearEvento',
            evento,
            error
        })
    }

}

const actualizarEvento = async (req, res = response) => {


    try {
        //obtengo el id de los parámetros
        const eventoId = req.params.id;
        //obtengo id de usuario desde el token
        const uid = req.uid;
        //variable para almacenar evento
        let evento;
        //verifico si el evento existe
        try {
            evento = await Evento.findById(eventoId);

            if (!evento) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Evento no existe por ese id'
                })
            }
        } catch (error) {
            return res.status(404).json({
                ok: false,
                msg: 'Id de evento no válido'
            })
        }
        //verifico si el evento corresponde al usuario
        if (evento.user.toString() !== uid) {

            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })

        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });


        res.status(200).json({
            ok: true,
            eventoActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizarEvento'
        })
    }

}


const eliminarEvento = async(req, res = response) => {



    try {

        //obtengo el id de los parámetros
        const eventoId = req.params.id;
        //obtengo id de usuario desde el token
        const uid = req.uid;
        //variable para almacenar evento
        let evento;
        //verifico si el evento existe
        try {
            evento = await Evento.findById(eventoId);

            if (!evento) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Evento no existe por ese id'
                })
            }
        } catch (error) {
            return res.status(404).json({
                ok: false,
                msg: 'Id de evento no válido'
            })
        }
        //verifico si el evento corresponde al usuario
        if (evento.user.toString() !== uid) {

            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            })

        }

        const eventoEliminado = await Evento.findByIdAndRemove( eventoId )

        res.status(200).json({
            ok: true,
            msg: 'eliminarEvento'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminarEvento'
        })
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}