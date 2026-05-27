const db = require('../config/db');

// CREATE
exports.createCampaign = async (req, res) => {
  try {

    const {
      title,
      description,
      target_amount
    } = req.body;

    const user_id = req.authUser.id;
    const [result] = await db.query(
      `INSERT INTO campaigns
      (title, description, target_amount, user_id)
      VALUES (?, ?, ?, ?)`,
      [title, description, target_amount, user_id]
    );

    res.status(201).json({
      message: 'Campaign berhasil dibuat',
      campaign_id: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// READ ALL
exports.getAllCampaigns = async (req, res) => {
  try {

    const [rows] = await db.query(
      'SELECT * FROM campaigns'
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// READ DETAIL
exports.getCampaignById = async (req, res) => {
  try {

    const [rows] = await db.query(
      'SELECT * FROM campaigns WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Campaign tidak ditemukan'
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
exports.updateCampaign = async (req, res) => {
  try {

    const { title, description, target_amount } = req.body;

    const [campaignRows] = await db.query(
      'SELECT * FROM campaigns WHERE id = ?',
      [req.params.id]
    );

    if (campaignRows.length === 0) {
      return res.status(404).json({
        message: 'Campaign tidak ditemukan'
      });
    }

    const campaign = campaignRows[0];

    // fundraiser hanya boleh edit campaign sendiri
if (
  req.authUser.role === 'fundraiser' &&
  campaign.user_id !== req.authUser.id
) {
  return res.status(403).json({
    message: 'Tidak boleh edit campaign orang lain'
  });
}

    await db.query(
      `UPDATE campaigns
      SET title = ?, description = ?, target_amount = ?
      WHERE id = ?`,
      [title, description, target_amount, req.params.id]
    );

    res.json({
      message: 'Campaign berhasil diupdate'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// DELETE
exports.deleteCampaign = async (req, res) => {
  try {

    await db.query(
      'DELETE FROM campaigns WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Campaign berhasil dihapus'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// VERIFY
exports.verifyCampaign = async (req, res) => {
  try {

    await db.query(
      `UPDATE campaigns
      SET verification_status = 'verified'
      WHERE id = ?`,
      [req.params.id]
    );

    res.json({
      message: 'Campaign berhasil diverifikasi'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};