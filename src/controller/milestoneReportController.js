const db = require('../config/db');


// CREATE REPORT
exports.createReport = async (req, res) => {
  try {

    const {
      milestone_id,
      description,
      progress_percentage,
      proof
    } = req.body;

    // cek milestone ada atau tidak
    const [milestoneRows] = await db.query(`
      SELECT
        milestones.*,
        campaigns.user_id
      FROM milestones
      JOIN campaigns
      ON milestones.campaign_id = campaigns.id
      WHERE milestones.id = ?
    `, [milestone_id]);

    if (milestoneRows.length === 0) {
      return res.status(404).json({
        message: 'Milestone tidak ditemukan'
      });
    }

    const milestone = milestoneRows[0];
    console.log('auth user:', req.authUser);
    console.log('milestone user:', milestone.user_id);
    
    // fundraiser hanya boleh buat report milestone miliknya
    if (
      req.authUser.role === 'fundraiser' &&
      milestone.user_id !== req.authUser.id
    ) {
      return res.status(403).json({
        message: 'Tidak boleh membuat report milestone orang lain'
      });
    }

    // insert report
    const [result] = await db.query(`
      INSERT INTO milestone_reports
      (
        milestone_id,
        description,
        progress_percentage,
        proof
      )
      VALUES (?, ?, ?, ?)
    `, [
      milestone_id,
      description,
      progress_percentage,
      proof
    ]);

    res.status(201).json({
      message: 'Report milestone berhasil dibuat',
      report_id: result.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};