const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

// Middleware xác thực JWT
function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.redirect('/login');
  }
}

// Trang chủ
router.get('/', (req, res) => {
  res.render('index');
});

// ===================== REGISTER =====================
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.render('register', { error: 'Please fill in all fields' });
  }

  try {
    // Kiểm tra email tồn tại
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.render('register', { error: 'Email already in use' });
    }

    // Hash mật khẩu
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu vào database
    await pool.query(
      'INSERT INTO users (full_name, password, email) VALUES ($1, $2, $3)',
      [username, password, email]
    );

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Error registering user' });
  }
});

// ===================== LOGIN =====================
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Please fill in all fields' });
  }

 try {
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}' `;
    console.log('Executing query:', query);

    const result = await pool.query(query);

    console.log('result.command:', result.command, 'rowCount:', result.rowCount);

    if (result.rows.length === 0) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    // Lấy user từ result
    const user = result.rows[0];
    // Tạo JWT token 
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Lưu token vào cookie (chỉ demo)
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('/dashboard');
  } catch (err) {
    console.error('[VULN] Login error:', err);
    return res.render('login', { error: 'Error logging in' });
  }
});
// ===================== LOGINv2 =====================
router.get('/loginv2', (req, res) => {
  res.render('loginv2', { error: null });
});
router.post('/loginv2', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render('login', { error: 'Please fill in all fields' });
  }
   try {
    // Tìm user theo email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const rows = result.rows;

    if (!rows.length) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    // Kiểm tra mật khẩu
    
    if (password !== rows[0].password) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Lưu token vào cookie
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error logging in' });
  }
}); 


// ===================== LOGOUT =====================
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// ===================== DASHBOARD =====================
router.get('/dashboard', authenticate, (req, res) => {
  res.render('dashboard', { user: req.user });
});

module.exports = router;
