const db = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {

    const role = req.authUser.role;
    const userId = req.authUser.id;

    // DASHBOARD ADMIN
    if (role === 'admin') {

      const [campaignRows] = await db.query(`
        SELECT COUNT(*) AS total_campaigns
        FROM campaigns
      `);

      const [donationRows] = await db.query(`
        SELECT IFNULL(SUM(amount), 0) AS total_donations
        FROM donations
        WHERE status = 'success'
      `);

      const [donaturRows] = await db.query(`
        SELECT COUNT(*) AS total_donators
        FROM users
        WHERE role = 'donatur'
      `);

      const [fundraiserRows] = await db.query(`
        SELECT COUNT(*) AS total_fundraisers
        FROM users
        WHERE role = 'fundraiser'
      `);

      const [milestoneRows] = await db.query(`
        SELECT COUNT(*) AS total_milestones
        FROM milestones
      `);

      return res.json({
        total_campaigns: campaignRows[0].total_campaigns,
        total_donations: donationRows[0].total_donations,
        total_donators: donaturRows[0].total_donators,
        total_fundraisers: fundraiserRows[0].total_fundraisers,
        total_milestones: milestoneRows[0].total_milestones
      });
    }

    // DASHBOARD FUNDRAISER
    const [campaignRows] = await db.query(`
      SELECT COUNT(*) AS total_campaigns
      FROM campaigns
      WHERE user_id = ?
    `, [userId]);

    const [donationRows] = await db.query(`
      SELECT IFNULL(SUM(d.amount), 0) AS total_donations
      FROM donations d
      INNER JOIN campaigns c
        ON d.campaign_id = c.id
      WHERE c.user_id = ?
      AND d.status = 'success'
    `, [userId]);

    const [milestoneRows] = await db.query(`
      SELECT COUNT(*) AS total_milestones
      FROM milestones m
      INNER JOIN campaigns c
        ON m.campaign_id = c.id
      WHERE c.user_id = ?
    `, [userId]);

    return res.json({
      total_campaigns: campaignRows[0].total_campaigns,
      total_donations: donationRows[0].total_donations,
      total_milestones: milestoneRows[0].total_milestones
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};