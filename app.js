var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {});
var UserController = require('./server/controllers/userController');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
app.use('/server', express.static(__dirname + '/server'));

server.listen(3000);
console.log('Server started.');

var Socket = require('./server/socket');

io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    Socket.list[socket.id] = socket;

    socket.on('signUp', function (data) {
        UserController.prototype.register(data, function (res) {
            if (res) {
                socket.emit('signUpResponse', {
                    success: false
                });
            } else {
                socket.emit('signUpResponse', {
                    success: true
                });
            }
        });
    });


    socket.on('signIn', function (data) {
        UserController.prototype.login(data, function (res) {
            if (res) {
                socket.emit('signInResponse', {
                    success: false
                });
            } else {
                socket.emit('signInResponse', {
                    success: true
                });
            }
        });
    });

    socket.on('disconnect', function () {
        delete Socket.list[socket.id];
    });


    socket.on('evalServer', function (data) {
        if (!DEBUG) {
            return;
        }
        var res = eval(data);
        socket.emit('evalAnswer', res);
    })
});
module.exports = app;