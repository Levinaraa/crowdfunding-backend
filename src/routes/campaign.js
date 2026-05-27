const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  verifyCampaign
} = require('../controller/campaignController');


// CREATE
router.post(
  '/',
  authenticateToken,
  authorizeRoles('fundraiser', 'admin'),
  createCampaign
);


// READ ALL
router.get(
  '/',
  authenticateToken,
  authorizeRoles('fundraiser', 'donatur', 'verifikator', 'admin'),
  getAllCampaigns
);


// READ DETAIL
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('fundraiser', 'donatur', 'verifikator', 'admin'),
  getCampaignById
);


// UPDATE
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('fundraiser', 'admin'),
  updateCampaign
);


// DELETE
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  deleteCampaign
);


// VERIFY
router.patch(
  '/verify/:id',
  authenticateToken,
  authorizeRoles('verifikator', 'admin'),
  verifyCampaign
);

module.exports = router;