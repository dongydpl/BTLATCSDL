const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// Khi vào /dashboard → chạy middleware authenticate trước, sau đó là getDashboard
router.get('/dashboard', dashboardController.authenticate, dashboardController.getDashboard);

module.exports = router;
