const { response } = require('express');
const Event = require('../models/Event');


const getEvents = async (req, res = response) => {

    const events = await Event.find()
        .populate('user', 'name');

    res.json({
        ok: true,
        events
    })

}

const createEvents = async (req, res = response) => {

    const event = new Event(req.body);

    try {

        event.user = req.uid;

        const eventSave = await event.save();

        res.json({
            ok: true,
            event: eventSave
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }
}

const updateEvents = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const evenstUpdated = await Event.findByIdAndUpdate(eventId, newEvent);

        res.json({
            ok: true,
            event: evenstUpdated
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

const deleteEvents = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })
        }

        await Event.findByIdAndDelete( eventId );

        res.json({
            ok: true,
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

module.exports = {
    getEvents,
    createEvents,
    updateEvents,
    deleteEvents
}