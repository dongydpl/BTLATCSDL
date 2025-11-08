const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.redirect('/login');
  }
};

// Xử lý khi truy cập /dashboard
exports.getDashboard = (req, res) => {
  res.render('dashboard', { user: req.user });
};
