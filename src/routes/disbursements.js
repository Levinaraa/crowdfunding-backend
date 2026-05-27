const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const {
  createDisbursement,
  getAllDisbursements,
  getDisbursementById,
  releaseDisbursement
} = require('../controller/disbursementController');


// CREATE
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  createDisbursement
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
  getAllDisbursements
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
  getDisbursementById
);


// RELEASE
router.patch(
  '/release/:id',
  authenticateToken,
  authorizeRoles('admin'),
  releaseDisbursement
);

module.exports = router;