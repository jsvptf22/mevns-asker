const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

require("dotenv").config({ path: ".env" });
const { host, port } = require("./app/src/back/routes/enviromentvars");

//conexion a mongodb
require("mongoose")
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("db connection ok");
    })
    .catch(() => {
        console.log("db connection error");
    });

//configuracion api
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use("/api/room", require("./app/src/back/routes/room"));

//archivos estaticos
app.use("/public", express.static(__dirname + "/app/public"));
app.use("/scripts", express.static(__dirname + "/node_modules"));
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/app/public/roomSelecter.html");
});
app.get("/room.html", function(req, res) {
    res.sendFile(__dirname + "/app/public/room.html");
});

//configuracion socketio
require("./app/src/back/socket/roomSelecter")(io);
require("./app/src/back/socket/room")(io);

//se levanta el servidor
server.listen(port, host, () => {
    console.log(`listening on ${host}:${port}`);
});
