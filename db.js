// Load the mysql2 library so Node.js can communicate with MySQL.
const mysql = require('mysql2');

// Load environment variables from the .env file.
// This keeps our database credentials outside the source code.
require('dotenv').config();

// Create a connection pool for our MySQL database.
//
// A connection pool allows the application to reuse database
// connections instead of opening a brand-new connection for every request.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Export the pool so index.js can use it to run SQL queries.
module.exports = pool;