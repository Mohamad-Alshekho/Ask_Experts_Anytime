const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'ask_experts_anytime',
    password: 'database-password'
})

module.exports = pool.promise();
