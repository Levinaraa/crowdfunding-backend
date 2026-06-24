const db = require('../config/db');


// CREATE VERIFICATION
exports.createVerification = async (req, res) => {
  try {

    const {
      milestone_id,
      status,
      notes
    } = req.body;

    const verifier_id = req.authUser.id;

    // cek milestone ada
    const [milestoneRows] = await db.query(
      'SELECT * FROM milestones WHERE id = ?',
      [milestone_id]
    );

    if (milestoneRows.length === 0) {
      return res.status(404).json({
        message: 'Milestone tidak ditemukan'
      });
    }

    // insert verification
    const [result] = await db.query(`
      INSERT INTO milestone_verifications
      (
        milestone_id,
        verifier_id,
        status,
        notes
      )
      VALUES (?, ?, ?, ?)
    `, [
      milestone_id,
      verifier_id,
      status,
      notes
    ]);

    // update status milestone
    if (status === 'approved') {

      await db.query(`
        UPDATE milestones
        SET status = 'completed'
        WHERE id = ?
      `, [milestone_id]);

    }

    res.status(201).json({
      message: 'Milestone berhasil diverifikasi',
      verification_id: result.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

// GET ALL VERIFICATIONS
exports.getAllVerifications = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        milestone_verifications.*,
        milestones.title AS milestone_title,
        users.name AS verifier_name
      FROM milestone_verifications
      JOIN milestones
      ON milestone_verifications.milestone_id = milestones.id
      JOIN users
      ON milestone_verifications.verifier_id = users.id
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};


// GET DETAIL VERIFICATION
exports.getVerificationById = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *
      FROM milestone_verifications
      WHERE id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Verification tidak ditemukan'
      });
    }

    res.json(rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};