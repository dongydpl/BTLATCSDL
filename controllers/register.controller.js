const express = require('express');
const router = express.Router();

const pool = require('../db');
require('dotenv').config();

class RegisterController {
    // Render trang đăng ký
    static renderRegisterPage(req, res) {
        res.render('register');
    }
    // Xử lý đăng ký
    static async handleRegister(req, res) {
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

            // Lưu vào database
            await pool.query(
                'INSERT INTO users (full_name, password, email) VALUES ($1, $2, $3)',
                [username, password, email]
            );    
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.render('register', { error: 'Error registering user' });
        }
    }
}
module.exports = RegisterController;


// router.get('/register', (req, res) => {
//   res.render('register');
// });

// router.post('/register', async (req, res) => {
//   const { username, password, email } = req.body;

//   if (!username || !password || !email) {
//     return res.render('register', { error: 'Please fill in all fields' });
//   }

//   try {
//     // Kiểm tra email tồn tại
//     const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (result.rows.length > 0) {
//       return res.render('register', { error: 'Email already in use' });
//     }

//     // Hash mật khẩu
//     //const hashedPassword = await bcrypt.hash(password, 10);

//     // Lưu vào database
//     await pool.query(
//       'INSERT INTO users (full_name, password, email) VALUES ($1, $2, $3)',
//       [username, password, email]
//     );

//     res.redirect('/login');
//   } catch (err) {
//     console.error(err);
//     res.render('register', { error: 'Error registering user' });
//   }
// });