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

    if (
      req.authUser.role === 'fundraiser' &&
      milestone.user_id !== req.authUser.id
    ) {
      return res.status(403).json({
        message: 'Tidak boleh membuat report milestone orang lain'
      });
    }

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

// GET ALL REPORTS
exports.getAllReports = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        mr.*,
        m.title AS milestone_title,
        c.title AS campaign_title
      FROM milestone_reports mr
      JOIN milestones m
        ON mr.milestone_id = m.id
      JOIN campaigns c
        ON m.campaign_id = c.id
      ORDER BY mr.created_at DESC
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};

// GET REPORTS BY MILESTONE
exports.getReportsByMilestone = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT *
      FROM milestone_reports
      WHERE milestone_id = ?
      ORDER BY created_at DESC
    `, [req.params.milestoneId]);

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};