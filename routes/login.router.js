const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');


// Render Login Page
router.get('/login', loginController.renderLoginPage);

//
router.post('/api/v1/login', loginController.handleLogin);



module.exports = router;
