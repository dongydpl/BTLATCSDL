const { Pool } = require('pg');
require('dotenv').config();
// Use environment variables for security (recommended)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT, // default PostgreSQL port 
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

const originalQuery = pool.query.bind(pool);

function buildFullQuery(query, values = []) {
  let fullQuery = query;
  values.forEach((val, i) => {
    const safeVal = typeof val === 'string' ? `'${val}'` : val;
    fullQuery = fullQuery.replace(`$${i + 1}`, safeVal);
  });
  return fullQuery;
}

pool.query = async (...args) => {
  const [text, values] = args;
  lastQuery = { text, values };
  const sqlPreview = buildFullQuery(text, values);
  console.log('🧩 Full SQL:', sqlPreview); // ✅ In câu truy vấn hoàn chỉnh
  return originalQuery(...args);
};


module.exports = pool;
