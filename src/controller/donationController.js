const db = require('../config/db');


// CREATE DONATION
exports.createDonation = async (req, res) => {
  try {

    const {
      campaign_id,
      amount,
      message
    } = req.body;

    const user_id = req.authUser.id;

    // cek campaign ada
    const [campaign] = await db.query(
      'SELECT * FROM campaigns WHERE id = ?',
      [campaign_id]
    );

    if (campaign.length === 0) {
      return res.status(404).json({
        message: 'Campaign tidak ditemukan'
      });
    }

    const [result] = await db.query(
      `INSERT INTO donations
      (campaign_id, user_id, amount, message)
      VALUES (?, ?, ?, ?)`,
      [campaign_id, user_id, amount, message]
    );

    res.status(201).json({
      message: 'Donasi berhasil',
      user_id: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// GET ALL DONATIONS
exports.getAllDonations = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT 
        donations.*,
        users.name AS donor_name,
        campaigns.title AS campaign_title
      FROM donations
      JOIN users ON donations.user_id = users.id
      JOIN campaigns ON donations.campaign_id = campaigns.id
    `);

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// GET MY DONATIONS
exports.getMyDonations = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT 
        donations.*,
        campaigns.title AS campaign_title
      FROM donations
      JOIN campaigns ON donations.campaign_id = campaigns.id
      WHERE user_id = ?
    `, [req.authUser.id]);

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// GET DETAIL DONATION
exports.getDonationById = async (req, res) => {
  try {

    const [rows] = await db.query(
      'SELECT * FROM donations WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Donation tidak ditemukan'
      });
    }

    const donation = rows[0];

    // donatur hanya bisa lihat donation miliknya
    if (
      req.authUser.role === 'donatur' &&
      donation.user_id !== req.authUser.id
    ) {
      return res.status(403).json({
        message: 'Tidak boleh melihat donation orang lain'
      });
    }

    res.json(donation);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

