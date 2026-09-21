const mysql = require('mysql2/promise');

// الإعدادات تُقرأ من ملف .env (القيم الافتراضية تناسب XAMPP المحلي)
// DB_SSL=true مطلوب لقواعد البيانات السحابية (مثل TiDB Cloud أو Aiven)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kids_platform',
    ssl: process.env.DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
