const request = require('request');

exports = module.exports = function(io) {
    const host = process.env.HOST;
    const port = process.env.PORT;
    const nsp = io.of('/roomSelecter');

    nsp.on('connection', function(socket) {
        socket.on('refreshRooms', () => {
            request
                .get(`http://${host}:${port}/api/room`)
                .on('data', function(response) {
                    let rooms = JSON.parse(response).data;
                    nsp.emit('refreshRooms', rooms);
                })
                .on('error', function(err) {
                    console.log(err);
                });
        });
    });
};
