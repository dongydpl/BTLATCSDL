const jwt = require('jsonwebtoken');
const pool = require('../db');


class LoginV2Controller {
    static async renderLoginPagev2(req, res) {
        res.render('loginv2');
    }
    static async handleLoginv2(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('loginv2', { error: 'Please fill in all fields' });
        }
        try {
            // Tìm user theo email
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const rows = result.rows;
            if (!rows.length) {
                return res.render('loginv2', { error: 'Invalid email or password' });
            }   
            // Kiểm tra mật khẩu
            if (password !== rows[0].password) {
                return res.render('loginv2', { error: 'Invalid email or password' });
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
    }
}
module.exports = LoginV2Controller;