// الاستخدام: npm run make-admin -- email@example.com
require('dotenv').config();
const db = require('../config/db');

(async () => {
    const email = process.argv[2];
    if (!email) {
        console.log('الاستخدام: npm run make-admin -- email@example.com');
        process.exit(1);
    }
    const [result] = await db.query("UPDATE users SET role = 'admin' WHERE parent_email = ?", [email]);
    console.log(result.affectedRows ? `تم: ${email} أصبح مديراً` : `لا يوجد مستخدم بهذا البريد: ${email}`);
    process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
