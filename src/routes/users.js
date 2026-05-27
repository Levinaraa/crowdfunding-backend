const express = require('express');
const db = require('../config/db');
const authenticateToken = require('../middlewares/authmiddle');
const authorizeRoles = require('../middlewares/rolemiddleware');

const router = express.Router();

console.log("USER ROUTER LOADED");
console.log("MIDDLEWARE:", typeof authenticateToken);


// PUBLIC TEST
router.get('/test', (req, res) => {
  res.json({ message: 'PUBLIC OK!' });
});

// TEST MIDDLEWARE
router.get('/auth-test', authenticateToken, (req, res) => {
  res.json({ 
    message: 'MIDDLEWARE Berhasil!', 
    user: req.authUser 
  });
});

// GET ALL USERS
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role FROM users'
    );

    res.json({
      message: 'Berhasil ambil semua user',
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal ambil data user',
      error: error.message
    });
  }
});

// GET USER LOGIN (TOKEN)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.authUser.id;

    const [rows] = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      message: 'Berhasil ambil user login',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error ambil user',
      error: error.message
    });
  }
});

// GET USER BY ID
router.get('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    const [rows] = await db.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      message: 'Berhasil ambil detail user',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error ambil detail user',
      error: error.message
    });
  }
});

// CREATE USER
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {

    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: 'Semua field wajib diisi'
      });
    }

    const [result] = await db.query(
      'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
      [name, email, role]
    );

    res.status(201).json({
      message: 'User berhasil dibuat',
      data: {
        id: result.insertId,
        name,
        email,
        role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error create user',
      error: error.message
    });
  }
});

// UPDATE USER
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {

    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: 'Semua field wajib diisi'
      });
    }

    const [result] = await db.query(
      'UPDATE users SET name=?, email=?, role=? WHERE id=?',
      [name, email, role, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      message: 'User berhasil diupdate'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error update user',
      error: error.message
    });
  }
});

// DELETE USER
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {

    const [result] = await db.query(
      'DELETE FROM users WHERE id=?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      message: 'User berhasil dihapus'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error delete user',
      error: error.message
    });
  }
});

module.exports = router;
