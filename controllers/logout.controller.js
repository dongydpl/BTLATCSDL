const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');


class LogoutController {
    static handleLogout(req, res) {
        res.clearCookie('token');
        res.redirect('/login');
    }
}
module.exports = LogoutController;



// exports.get('/logout', (req, res) => {
//   res.clearCookie('token');
//   res.redirect('/login');
// });