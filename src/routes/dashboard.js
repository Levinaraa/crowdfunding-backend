const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');

const {
  getDashboard
} = require('../controller/dashboardController');


// DASHBOARD
router.get(
  '/',
  authenticateToken,
  getDashboard
);

module.exports = router;