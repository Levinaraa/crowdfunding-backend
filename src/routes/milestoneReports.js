const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const {
  createReport,
  getReportsByMilestone
} = require('../controller/milestoneReportController');


// CREATE REPORT
router.post(
  '/',
  authenticateToken,
  authorizeRoles('fundraiser', 'admin'),
  createReport
);

router.get(
  '/milestone/:milestoneId',
  authenticateToken,
  authorizeRoles('donatur', 'fundraiser', 'admin'),
  getReportsByMilestone
);
module.exports = router;