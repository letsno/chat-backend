const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',     // or your DB host
  user: 'root',          // your DB username
  password: '',          // your DB password
  database: 'ocean_db'   // your DB name
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

module.exports = db;
