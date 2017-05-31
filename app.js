var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, {});
var User = require('./server/User');
var UserController = require('./server/controllers/userController');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
app.use('/server', express.static(__dirname + '/server'));

server.listen(3000);
console.log('Server started.');

var DEBUG = true;

var Socket = require('./server/socket');

io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    Socket.list[socket.id] = socket;

    socket.on('signUp', function (data) {
        UserController.prototype.register(data, function (res) {
            if (res) {
                socket.emit('signUpResponse', {
                    success: true
                });
            } else {
                socket.emit('signUpResponse', {
                    success: false
                });
            }
        });
    });

    socket.on('signIn', function (data) {
        UserController.prototype.login(data, function (res) {
            if (res) {
                User.onConnect(socket, data.username);
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

    socket.on('sendMsgToServer', function (data) {
        var playerName = ('' + socket.id).slice(2, 7);
        for (var i in Socket.list) {
            Socket.list[i].emit('addToChat', playerName + ': ' + data);
        }
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