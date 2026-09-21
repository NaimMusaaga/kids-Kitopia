const mysql = require('mysql2/promise');

// الإعدادات تُقرأ من ملف .env (القيم الافتراضية تناسب XAMPP المحلي)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kids_platform',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
