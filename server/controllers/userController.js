/**
 * Created by haspa on 30.05.17.
 */
var mongojs = require("mongojs");
var db = mongojs('localhost:27017/financials', ['user', 'konto']);

function UserController() {

}

UserController.prototype.register = function (data, cb) {
    isUsernameTaken(data, function (res) {
        if (res) {
            cb(false);
        } else {
            addUser(data, function () {
                cb(true);
            });
            cb(true);
        }
    });
};

UserController.prototype.login = function (data, cb) {
    isValidPassword(data, function (res) {
        if (res) {
            cb(true);
        } else {
            cb(false);
        }
    });
};

var isValidPassword = function (data, cb) {
    db.user.find({
        username: data.username,
        password: data.password
    }, function (err, res) {        
        if (res.length > 0) {
            cb(false);
        } else {
            cb(true);
        }
    })
};

var isUsernameTaken = function (data, cb) {
    db.user.find({
        username: data.username
    }, function (err, res) {
        if (res.length > 0) {
            cb(true);
        } else {
            cb(false);
        }
    })
};

var addUser = function (data, cb) {
    db.user.insert({
        username: data.username,
        password: data.password,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        birthdate: data.birthdate,
        address: data.address
    }, function (err) {
        cb();
    });
};

module.exports = UserController;