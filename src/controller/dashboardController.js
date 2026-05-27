const db = require('../config/db');


// DASHBOARD SUMMARY
exports.getDashboard = async (req, res) => {
  try {

    // total campaign
    const [campaignRows] = await db.query(`
      SELECT COUNT(*) AS total_campaigns
      FROM campaigns
    `);

    // total donasi sukses
    const [donationRows] = await db.query(`
      SELECT
        IFNULL(SUM(amount), 0) AS total_donations
      FROM donations
      WHERE status = 'success'
    `);

    // total donatur
    const [donaturRows] = await db.query(`
      SELECT COUNT(*) AS total_donators
      FROM users
      WHERE role = 'donatur'
    `);

    // total fundraiser
    const [fundraiserRows] = await db.query(`
      SELECT COUNT(*) AS total_fundraisers
      FROM users
      WHERE role = 'fundraiser'
    `);

    // total milestone
    const [milestoneRows] = await db.query(`
      SELECT COUNT(*) AS total_milestones
      FROM milestones
    `);

    res.json({
      total_campaigns: campaignRows[0].total_campaigns,
      total_donations: donationRows[0].total_donations,
      total_donators: donaturRows[0].total_donators,
      total_fundraisers: fundraiserRows[0].total_fundraisers,
      total_milestones: milestoneRows[0].total_milestones
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};