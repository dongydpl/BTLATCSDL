const jwt = require('jsonwebtoken');
const pool = require('../db');


class LoginController {
    static async renderLoginPage(req, res) {
        res.render('login');
    }
    static async handleLogin(req, res) {
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
    }
}


module.exports = LoginController;


// exports.get('/login', (req, res) => {
//     res.render('login');
// });

// exports.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.render('login', { error: 'Please fill in all fields' });
//     }

//     try {
//         const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}' `;
//         console.log('Executing query:', query);

//         const result = await pool.query(query);

//         console.log('result.command:', result.command, 'rowCount:', result.rowCount);

//         if (result.rows.length === 0) {
//             return res.render('login', { error: 'Invalid email or password' });
//         }

//         // Lấy user từ result
//         const user = result.rows[0];
//         // Tạo JWT token 
//         const token = jwt.sign(
//             { id: user.id, username: user.username },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         // Lưu token vào cookie (chỉ demo)
//         res.cookie('token', token, { httpOnly: true });
//         return res.redirect('/dashboard');
//     } catch (err) {
//         console.error('[VULN] Login error:', err);
//         return res.render('login', { error: 'Error logging in' });
//     }
// });