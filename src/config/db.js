const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'api_user',    
  password: 'simple123', 
  database: 'db_tubes',
  port: 5000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;