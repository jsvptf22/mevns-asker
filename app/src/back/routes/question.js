const express = require("express");
const router = express.Router({ mergeParams: true });

const Room = require("../database/RoomModel");
var Response = require("../routes/Response.js");

router.get("/", (req, res) => {
    let getResponse = new Response();

    try {
        let roomId = req.params.roomId;

        if (!roomId.length) {
            throw "Debe indicar la sala";
        }

        Room.findById(roomId)
            .then(Model => {
                getResponse.data = Model.questions;
                getResponse.success = 1;
                res.send(getResponse.getObject());
            })
            .catch(err => {
                throw err;
            });
    } catch (error) {
        getResponse.message = error;
        res.send(getResponse.getObject());
    }
});

router.post("/:label", (req, res) => {
    let postResponse = new Response();

    try {
        let roomId = req.params.roomId;
        let label = req.params.label;

        if (!roomId.length) {
            throw "Debe indicar la sala";
        }

        if (!label.length) {
            throw "Debe indicar la pregunta";
        }

        let question = { label };
        Room.findById(roomId)
            .then(Model => {
                Model.questions.push(question);
                Model.save()
                    .then(() => {
                        postResponse.message = "Pregunta creada";
                        postResponse.success = 1;
                        res.send(postResponse.getObject());
                    })
                    .catch(err => {
                        throw err;
                    });
            })
            .catch(err => {
                throw err;
            });
    } catch (error) {
        postResponse.message = error;
        res.send(postResponse.getObject());
    }
});

router.post("/:id/vote/:action", (req, res) => {
    let postResponse = new Response();

    try {
        let roomId = req.params.roomId;
        let id = req.params.id;
        let action = req.params.action;

        if (!roomId.length) {
            throw "Debe indicar la sala";
        }

        if (!id.length) {
            throw "Debe indicar la pregunta";
        }

        if (!action.length) {
            throw "Debe indicar la acción";
        }

        Room.findById(roomId)
            .then(Model => {
                let doc = Model.questions.id(id);

                if (+action) {
                    doc.approve = +doc.approve + 1;
                } else {
                    doc.reject = +doc.reject + 1;
                }

                Model.save()
                    .then(() => {
                        postResponse.message = "Voto asignado";
                        postResponse.success = 1;
                        res.send(postResponse.getObject());
                    })
                    .catch(err => {
                        throw err;
                    });
            })
            .catch(err => {
                throw err;
            });
    } catch (error) {
        postResponse.message = error;
        res.send(postResponse.getObject());
    }
});

module.exports = router;
