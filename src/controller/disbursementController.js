const db = require('../config/db');


// CREATE DISBURSEMENT
exports.createDisbursement = async (req, res) => {
  try {

    const {
      milestone_id,
      amount
    } = req.body;

    // cek milestone
    const [milestoneRows] = await db.query(
      'SELECT * FROM milestones WHERE id = ?',
      [milestone_id]
    );

    if (milestoneRows.length === 0) {
      return res.status(404).json({
        message: 'Milestone tidak ditemukan'
      });
    }

    const [result] = await db.query(`
      INSERT INTO disbursements
      (
        milestone_id,
        amount
      )
      VALUES (?, ?)
    `, [
      milestone_id,
      amount
    ]);

    res.status(201).json({
      message: 'Pencairan dana berhasil dibuat',
      disbursement_id: result.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};


// GET ALL
exports.getAllDisbursements = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        disbursements.*,
        milestones.title AS milestone_title
      FROM disbursements
      JOIN milestones
      ON disbursements.milestone_id = milestones.id
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};


// GET DETAIL
exports.getDisbursementById = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *
      FROM disbursements
      WHERE id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Pencairan dana tidak ditemukan'
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


// RELEASE DISBURSEMENT
exports.releaseDisbursement = async (req, res) => {
  try {

    await db.query(`
      UPDATE disbursements
      SET
        status = 'released',
        released_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [req.params.id]);

    res.json({
      message: 'Dana berhasil dicairkan'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};