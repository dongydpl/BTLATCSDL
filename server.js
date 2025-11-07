require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path'); 
const authRoutes = require('./route/auth'); 

const app = express();

// Cấu hình view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Middleware
app.use(express.urlencoded({ extended: false }));//doc data
app.use(cookieParser());
app.use(express.static('public')); 

// Gắn routes
app.use('/', authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
