const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const {
  createMilestone,
  getAllMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone
} = require('../controller/milestonesController');


// CREATE MILESTONE
router.post(
  '/',
  authenticateToken,
  authorizeRoles('fundraiser', 'admin'),
  createMilestone
);


// GET ALL MILESTONES
router.get(
  '/',
  authenticateToken,
  authorizeRoles('fundraiser', 'donatur', 'verifikator', 'admin'),
  getAllMilestones
);


// GET DETAIL MILESTONE
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('fundraiser', 'donatur', 'verifikator', 'admin'),
  getMilestoneById
);


// UPDATE MILESTONE
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('fundraiser', 'admin'),
  updateMilestone
);


// DELETE MILESTONE
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  deleteMilestone
);

module.exports = router;