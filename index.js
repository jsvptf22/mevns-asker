const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const cors = require('cors');

require('dotenv').config({ path: '.env' });
require('./app/src/back/database/connection');

//configuracion api
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
app.use('/api/room', require('./app/src/back/routes/room'));

//archivos estaticos
app.use('/public', express.static(__dirname + '/app/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/public/roomSelecter.html');
});
app.get('/room.html', function(req, res) {
    res.sendFile(__dirname + '/app/public/room.html');
});

//configuracion socketio
require('./app/src/back/socket/roomSelecter')(io);
require('./app/src/back/socket/room')(io);

//se levanta el servidor
const host = process.env.HOST;
const port = process.env.PORT;
server.listen(port, host, () => {
    console.log(`listening on ${host}:${port}`);
});
