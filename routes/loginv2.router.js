const express = require('express');
const router = express.Router();

const loginv2Controller = require('../controllers/loginv2.controller');
const LoginV2Controller = require('../controllers/loginv2.controller');

// Render Login V2 Page
router.get('/loginv2', LoginV2Controller.renderLoginPagev2);
// Handle Login V2
router.post('/api/v2/login', LoginV2Controller.handleLoginv2);
module.exports = router;
