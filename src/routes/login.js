const express = require('express');
const db = require('../config/db');
const { hashPassword, verifyPassword, signJwt, JWT_EXPIRES_IN_SECONDS } = require('../utils/authutils');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, dan password wajib diisi.'
      });
    }

    // validasi role 
    const allowedRoles = ['fundraiser', 'donatur', 'verifikator', 'admin'];

    const userRole = allowedRoles.includes(
      String(role || '').trim().toLowerCase()
    )
      ? role.trim().toLowerCase()
      : 'donatur';

    // cek email
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: 'Email sudah terdaftar.'
      });
    }

    // hash password
    const hashedPassword = hashPassword(password);

    // INSERT (PAKE role yang benar)
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole]
    );

    res.status(201).json({
      message: 'Register berhasil.',
      data: {
        id: result.insertId,
        name,
        email,
        role: userRole
      }
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);
    next(error);
  }
});

//Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email & password wajib diisi.' });
    }

    const [rows] = await db.query(
      'SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0 || !verifyPassword(password, rows[0].password)) {
      return res.status(401).json({ message: 'Email/password salah.' });
    }

    const user = rows[0];

    const token = signJwt({
      sub: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    });

    res.json({
      message: 'Login berhasil.',
      data: {
        token,
        token_type: 'Bearer',
        expires_in: JWT_EXPIRES_IN_SECONDS,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    next(error);
  }
});

module.exports = router;