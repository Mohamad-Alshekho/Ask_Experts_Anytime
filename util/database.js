const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'ask_experts_anytime',
    password: 'Mm533487'
})

module.exports = pool.promise();
