const request = require("request");

exports = module.exports = function(io) {
    const nsp = io.of("/room");

    nsp.on("connection", function(socket) {
        socket.on("defineRoom", roomName => {
            socket.join(roomName);
            nsp.in(roomName).emit("new", 1);
        });

        socket.on("refreshQuestions", data => {
            nsp.in(data.roomName).emit("refreshQuestions", data.questions);
        });
    });
};
