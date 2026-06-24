const db = require('../config/db');


// create 
exports.createMilestone = async (req, res) => {
  try {

    const {
      campaign_id,
      title,
      description,
      target_amount
    } = req.body;

    // cek campaign ada
    const [campaignRows] = await db.query(
      'SELECT * FROM campaigns WHERE id = ?',
      [campaign_id]
    );

    if (campaignRows.length === 0) {
      return res.status(404).json({
        message: 'Campaign tidak ditemukan'
      });
    }

    const campaign = campaignRows[0];

    // fundraiser cmn boleh buat milestone campaign punya sendiri
    if (
  req.authUser.role === 'fundraiser' &&
  campaign.user_id !== req.authUser.id
) {
  return res.status(403).json({
    message: 'Tidak boleh membuat milestone campaign orang lain'
  });
}

    const [result] = await db.query(
      `INSERT INTO milestones
      (campaign_id, title, description, target_amount)
      VALUES (?, ?, ?, ?)`,
      [campaign_id, title, description, target_amount]
    );

    res.status(201).json({
      message: 'Milestone berhasil dibuat',
      milestone_id: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// GET ALL
exports.getAllMilestones = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        milestones.*,
        campaigns.title AS campaign_title
      FROM milestones
      JOIN campaigns
      ON milestones.campaign_id = campaigns.id
    `);

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// GET DETAIL
exports.getMilestoneById = async (req, res) => {
  try {

    const [rows] = await db.query(
      'SELECT * FROM milestones WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Milestone tidak ditemukan'
      });
    }

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// UPDATE
exports.updateMilestone = async (req, res) => {
  try {

    const {
      title,
      description,
      target_amount
    } = req.body;

    const [milestoneRows] = await db.query(`
      SELECT
        milestones.*,
        campaigns.user_id
      FROM milestones
      JOIN campaigns
      ON milestones.campaign_id = campaigns.id
      WHERE milestones.id = ?
    `, [req.params.id]);

    if (milestoneRows.length === 0) {
      return res.status(404).json({
        message: 'Milestone tidak ditemukan'
      });
    }

    const milestone = milestoneRows[0];

    // fundraiser hanya boleh update milestone campaign miliknya
    if (
      req.authUser.role === 'fundraiser' &&
      milestone.user_id !== req.authUser.id
    ) {
      return res.status(403).json({
        message: 'Tidak boleh update milestone orang lain'
      });
    }

    await db.query(
      `UPDATE milestones
      SET title = ?, description = ?, target_amount = ?
      WHERE id = ?`,
      [title, description, target_amount, req.params.id]
    );

    res.json({
      message: 'Milestone berhasil diupdate'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE
exports.deleteMilestone = async (req, res) => {
  try {

    await db.query(
      'DELETE FROM milestones WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Milestone berhasil dihapus'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};