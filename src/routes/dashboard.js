const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const {
  getDashboard
} = require('../controller/dashboardController');

router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin', 'fundraiser'),
  getDashboard
);

module.exports = router;