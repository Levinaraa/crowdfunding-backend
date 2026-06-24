const db = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {

    const role = req.authUser.role;
    const userId = req.authUser.id;

    // =========================
    // DASHBOARD ADMIN
    // =========================
    if (role === 'admin') {

      const [campaignRows] = await db.query(`
        SELECT COUNT(*) AS total_campaigns
        FROM campaigns
      `);

      const [activeCampaignRows] = await db.query(`
        SELECT COUNT(*) AS active_campaigns
        FROM campaigns
        WHERE status = 'active'
      `);

      const [draftCampaignRows] = await db.query(`
        SELECT COUNT(*) AS draft_campaigns
        FROM campaigns
        WHERE status = 'draft'
      `);

      const [fundedCampaignRows] = await db.query(`
        SELECT COUNT(*) AS funded_campaigns
        FROM campaigns
        WHERE status = 'funded'
      `);

      const [completedCampaignRows] = await db.query(`
        SELECT COUNT(*) AS completed_campaigns
        FROM campaigns
        WHERE status = 'completed'
      `);

      const [rejectedCampaignRows] = await db.query(`
        SELECT COUNT(*) AS rejected_campaigns
        FROM campaigns
        WHERE status = 'rejected'
      `);

      const [donationRows] = await db.query(`
        SELECT IFNULL(SUM(amount),0) AS total_donations
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

      const [completedMilestoneRows] = await db.query(`
        SELECT COUNT(*) AS completed_milestones
        FROM milestones
        WHERE status = 'completed'
      `);

      const [pendingMilestoneRows] = await db.query(`
        SELECT COUNT(*) AS pending_milestones
        FROM milestones
        WHERE status = 'pending'
      `);

      return res.json({
        total_campaigns: campaignRows[0].total_campaigns,

        active_campaigns: activeCampaignRows[0].active_campaigns,
        draft_campaigns: draftCampaignRows[0].draft_campaigns,
        funded_campaigns: fundedCampaignRows[0].funded_campaigns,
        completed_campaigns: completedCampaignRows[0].completed_campaigns,
        rejected_campaigns: rejectedCampaignRows[0].rejected_campaigns,

        total_donations: donationRows[0].total_donations,

        total_donators: donaturRows[0].total_donators,
        total_fundraisers: fundraiserRows[0].total_fundraisers,

        total_milestones: milestoneRows[0].total_milestones,
        completed_milestones: completedMilestoneRows[0].completed_milestones,
        pending_milestones: pendingMilestoneRows[0].pending_milestones
      });
    }

    // =========================
    // DASHBOARD FUNDRAISER
    // =========================

    const [campaignRows] = await db.query(`
      SELECT COUNT(*) AS total_campaigns
      FROM campaigns
      WHERE user_id = ?
    `, [userId]);

    const [activeCampaignRows] = await db.query(`
      SELECT COUNT(*) AS active_campaigns
      FROM campaigns
      WHERE user_id = ?
      AND status = 'active'
    `, [userId]);

    const [fundedCampaignRows] = await db.query(`
      SELECT COUNT(*) AS funded_campaigns
      FROM campaigns
      WHERE user_id = ?
      AND status = 'funded'
    `, [userId]);

    const [donationRows] = await db.query(`
      SELECT IFNULL(SUM(d.amount),0) AS total_donations
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

    const [completedMilestoneRows] = await db.query(`
      SELECT COUNT(*) AS completed_milestones
      FROM milestones m
      INNER JOIN campaigns c
        ON m.campaign_id = c.id
      WHERE c.user_id = ?
      AND m.status = 'completed'
    `, [userId]);

    const [pendingMilestoneRows] = await db.query(`
      SELECT COUNT(*) AS pending_milestones
      FROM milestones m
      INNER JOIN campaigns c
        ON m.campaign_id = c.id
      WHERE c.user_id = ?
      AND m.status = 'pending'
    `, [userId]);

    return res.json({
      total_campaigns: campaignRows[0].total_campaigns,
      active_campaigns: activeCampaignRows[0].active_campaigns,
      funded_campaigns: fundedCampaignRows[0].funded_campaigns,

      total_donations: donationRows[0].total_donations,

      total_milestones: milestoneRows[0].total_milestones,
      completed_milestones: completedMilestoneRows[0].completed_milestones,
      pending_milestones: pendingMilestoneRows[0].pending_milestones
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};