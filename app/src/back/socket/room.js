const request = require('request');

exports = module.exports = function(io) {
    const host = process.env.HOST;
    const port = process.env.PORT;
    const nsp = io.of('/room');

    nsp.on('connection', function(socket) {
        socket.on('defineRoom', (roomName) => {
            socket.join(roomName);
        });

        socket.on('refreshQuestions', (room) => {
            request
                .get(`http://${host}:${port}/api/room/${room}/questions`)
                .on('data', function(response) {
                    let questions = JSON.parse(response).data;
                    nsp.in(room).emit('refreshQuestions', questions);
                })
                .on('error', function(err) {
                    console.log(err);
                });
        });
    });
};
