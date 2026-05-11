const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // إذا عندك كلمة سر للـ xampp حطها هنا
    database: 'kids_platform', // اسم الداتابيز اللي عندك
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;