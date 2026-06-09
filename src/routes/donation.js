const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const {
  createDonation,
  getAllDonations,
  getDonationById,
  getMyDonations,
  deleteDonation,
  getMyCampaignDonations
} = require('../controller/donationController');


// CREATE DONATION
router.post(
  '/',
  authenticateToken,
  authorizeRoles('donatur', 'admin'),
  createDonation
);


// GET ALL DONATIONS
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  getAllDonations
);


// GET MY DONATIONS
router.get(
  '/my',
  authenticateToken,
  authorizeRoles('donatur', 'admin'),
  getMyDonations
);


// GET DETAIL DONATION
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('donatur', 'admin'),
  getDonationById
);

// GET DONATIONS FOR MY CAMPAIGNS (FUNDRAISER)
router.get(
  '/campaigns/my',
  authenticateToken,
  authorizeRoles('fundraiser', 'admin'),
  getMyCampaignDonations
);

module.exports = router;