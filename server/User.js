/**
 * Created by haspa on 31.05.17.
 */
var Socket = require('./socket');

var initPack = {
    user: []
};
var removePack = {
    user: []
};

User = function (param) {
    var self = {
        number : "" + Math.floor(10 * Math.random()),
        username: param.email,
        konten: [],
        email: param.email,
        firstname: param.firstname,
        lastname: param.lastname,
        birthdate: param.birthdate,
        address: param.address
    };

    self.update = function () {

    };

    self.getInitPack = function () {
        return {
            id: self.id,
            number: self.number,
        }
    };

    self.getUpdatePack = function () {
        return {
            id: self.id,
        }
    };

    User.list[self.id] = self;

    initPack.user.push(self.getInitPack());

    return self;
};

User.getFrameUpdateData = function () {
    var pack = {
        initPack: {
            user: initPack.user
        },
        removePack: {
            user: removePack.user
        },
        updatePack: {
            user: User.update()
        }
    };

    initPack.user = [];
    removePack.user = [];

    return pack;
};

User.list = {};

User.onConnect = function (socket, username) {
    var user = User({
        username: username,
        id: socket.id,
        socket: socket
    });

    socket.emit('init', {
        user: User.getAllInitPack(),
        selfId: socket.id
    });

    socket.on('sendMsgToServer', function (data) {
        for (var i in Socket.list) {
            Socket.list[i].emit('addToChat', user.username + ': ' + data);
        }
    });

    socket.on('sendPmToServer', function (data) {
        var recipientSocket = null;
        for (var i in User.list) {
            if (User.list[i].username === data.username) {
                recipientSocket = Socket.list[i];
            }
        }
        if (recipientSocket === null) {
            socket.emit('addToChat', 'The player ' + data.username + ' is not online.');
        } else {
            recipientSocket.emit('addToChat', 'From ' + user.username + ':' + data.message);
            socket.emit('addToChat', 'To ' + data.username + ':' + data.message);
        }
    });
};

User.getAllInitPack = function () {
    var users = [];
    for (var i in User.list) {
        users.push(User.list[i].getInitPack());
    }
    return users;
};

User.update = function () {
    var pack = [];
    for (var j in User.list) {
        var user = User.list[j];
        user.update();
        pack.push(user.getUpdatePack());
    }
    return pack;
};

User.onDisconnect = function (socket) {
    delete User.list[socket.id];
    removePack.user.push(socket.id);
};



module.exports = User;