/**
 * Created by haspa on 20.04.17.
 */
//sign
var socket = io();
var WIDTH = 500;
var HEIGHT = 500;

var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivFirstname = document.getElementById('signDiv-firstname');
var signDivLastname = document.getElementById('signDiv-lastname');
var signDivBirthdate = document.getElementById('signDiv-birthdate');
var signDivStreet = document.getElementById('signDiv-street');
var signDivNumber = document.getElementById('signDiv-number');
var signDivZipcode = document.getElementById('signDiv-zipcode');
var signDivCity = document.getElementById('signDiv-city');
var signDivCountry = document.getElementById('signDiv-country');
var signDivPassword = document.getElementById('signDiv-password');
var signDivEmail = document.getElementById('signDiv-email');
var loginDivUsername = document.getElementById('loginDiv-username');
var loginDivPassword = document.getElementById('loginDiv-password');
var gameDiv = document.getElementById('gameDiv');

signDivSignIn.onclick = function (e) {
    e.preventDefault();
    socket.emit('signIn', ({
        username: loginDivUsername.value,
        password: loginDivPassword.value
    }));
};

socket.on('signInResponse', function (data) {
    if (data.success) {
        signDiv.style.display = 'none';
        gameDiv.style.display = 'inline-block';
    } else {
        alert('Sign in not successful!');
    }
});

signDivSignUp.onclick = function (e) {
    e.preventDefault();
    socket.emit('signUp', ({
        username: signDivUsername.value,
        password: signDivPassword.value,
        email: signDivEmail.value,
        firstname: signDivEmail.value,
        lastname: signDivEmail.value,
        birthdate: signDivBirthdate.value,
        address: {
            street: signDivStreet.value,
            number: signDivNumber.value,
            zipcode: signDivZipcode.value,
            city: signDivCity.value,
            country: signDivCountry.value
        }
    }));
};

socket.on('signUpResponse', function (data) {
    if (data.success) {
        alert('Sign up successful!');
    } else {
        alert('Sign up not successful!');
    }
});