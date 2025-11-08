const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/register.controller');
// Render Register Page
router.get('/register', RegisterController.renderRegisterPage);
// Handle Register
router.post('/register', RegisterController.handleRegister);
module.exports = router;