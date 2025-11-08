require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path'); 
const app = express();

// Cấu hình view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));


// Middleware
app.use(express.urlencoded({ extended: false }));//doc data
app.use(cookieParser());
app.use(express.static('public')); 

//routes
const loginRoutes = require('./routes/login.router');
const logoutRoutes = require('./routes/logout.router');
const dashboardRoutes = require('./routes/dashboard.router');
const registerRoutes = require('./routes/register.router');
const indexRoutes = require('./routes/index.router');
const loginv2Routes = require('./routes/loginv2.router');

app.use('/', indexRoutes);
app.use('/', logoutRoutes);
app.use('/', loginRoutes);
app.use('/', dashboardRoutes);
app.use('/', registerRoutes);
app.use('/', loginv2Routes);


//starrt server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
