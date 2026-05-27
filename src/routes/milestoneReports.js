const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const {
  createReport
} = require('../controller/milestoneReportController');


// CREATE REPORT
router.post(
  '/',
  authenticateToken,
  authorizeRoles('fundraiser', 'admin'),
  createReport
);

module.exports = router;