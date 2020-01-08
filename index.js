const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const request = require("request");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

require("dotenv").config({ path: ".env" });
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

app.use("/public", express.static(__dirname + "/app/public"));
app.use("/scripts", express.static(__dirname + "/node_modules"));
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use("/api/room", require("./app/src/back/routes/room"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/app/public/index.html");
});

let host = process.env.HOST || "0.0.0.0";
let port = process.env.PORT || 3000;

io.on("connection", function(socket) {
    socket.on("refreshRooms", () => {
        request
            .get(`http://${host}:${port}/api/room`)
            .on("data", function(response) {
                let rooms = JSON.parse(response).data;
                io.emit("refreshRooms", rooms);
            })
            .on("error", function(err) {
                console.log(err);
            });
    });

    socket.on("refreshQuestions", data => {
        io.emit("refreshQuestions", data);
    });
});

server.listen(port, host, () => {
    console.log(`listening on ${host}:${port}`);
});
