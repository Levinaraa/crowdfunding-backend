const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const {
  createVerification,
  getAllVerifications,
  getVerificationById
} = require('../controller/milestoneVerificationController');


// CREATE VERIFICATION
router.post(
  '/',
  authenticateToken,
  authorizeRoles('verifikator', 'admin'),
  createVerification
);


// GET ALL
router.get(
  '/',
  authenticateToken,
  authorizeRoles(
    'fundraiser',
    'donatur',
    'verifikator',
    'admin'
  ),
  getAllVerifications
);


// GET DETAIL
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles(
    'fundraiser',
    'donatur',
    'verifikator',
    'admin'
  ),
  getVerificationById
);

module.exports = router;