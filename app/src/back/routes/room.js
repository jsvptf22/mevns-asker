const express = require("express");
const router = express.Router();

const Room = require("../database/RoomModel");
var Response = require("../routes/Response.js");
const questionRoutes = require("./question");

router.get("/", (req, res) => {
    let getResponse = new Response();

    try {
        Room.find()
            .then(data => {
                getResponse.data = data;
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

router.get("/:id", (req, res) => {
    let getResponse = new Response();

    try {
        let id = req.params.id;

        if (!id.length) {
            throw "Debe indicar la sala";
        }

        Room.findById(id)
            .then(Model => {
                getResponse.data = Model;
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

router.post("/:name", (req, res) => {
    let postResponse = new Response();

    try {
        let name = req.params.name;

        if (!name.length) {
            throw "Debe indicar el nombre de la sala";
        }

        let newRoom = new Room({ name });
        newRoom
            .save()
            .then(() => {
                postResponse.data = {
                    roomId: newRoom._id
                };
                postResponse.message = "Sala creada";
                postResponse.success = 1;
                res.send(postResponse.getObject());
            })
            .catch(err => {
                throw err;
            });
    } catch (error) {
        postResponse.message = error;
        res.send(postResponse.getObject());
    }
});

router.put("/:id", (req, res) => {
    let putResponse = new Response();

    try {
        let id = req.params.id;

        if (!id.length) {
            throw "Debe indicar la sala";
        }

        Room.findByIdAndUpdate(id, req.body)
            .then(() => {
                putResponse.message = "Sala actualizada";
                putResponse.success = 1;
                res.send(putResponse.getObject());
            })
            .catch(err => {
                throw err;
            });
    } catch (error) {
        putResponse.message = error;
        res.send(putResponse.getObject());
    }
});

router.delete("/:id", (req, res) => {
    let deleteResponse = new Response();

    try {
        let id = req.params.id;

        if (!id.length) {
            throw "Debe indicar la sala";
        }

        Room.findByIdAndDelete(id)
            .then(() => {
                deleteResponse.message = "Sala eliminada";
                deleteResponse.success = 1;
                res.send(deleteResponse.getObject());
            })
            .catch(err => {
                throw err;
            });
    } catch (error) {
        deleteResponse.message = error;
        res.send(deleteResponse.getObject());
    }
});

router.use("/:roomId/questions", questionRoutes);
module.exports = router;
