const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const {
  getDashboard
} = require('../controller/dashboardController');

// DASHBOARD
router.get(
  '/',
  authenticateToken,
  authorizeRoles('fundraiser', 'admin'),
  getDashboard
);

module.exports = router;