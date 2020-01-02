var express = require("express");
var http = require("http");
var socketIo = require("socket.io");

var app = express();
var http = http.createServer(app);
var io = socketIo(http);

app.use("/public", express.static(__dirname + "/public"));
app.use("/scripts", express.static(__dirname + "/node_modules"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", function(socket) {
    socket.on("refreshQuestions", data => {
        io.emit("refreshQuestions", data);
    });
});

http.listen(9000, function() {
    console.log("listening on *:9000");
});
