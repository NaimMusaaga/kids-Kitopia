const jwt = require('jsonwebtoken');
const db = require('../config/db');

// يتحقق من التوكن ويضع بيانات المستخدم في req.user
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: "غير مصرح لك بالدخول" });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "التوكن غير صالح أو منتهي" });
    }
};

// يجب استخدامه بعد protect. يقرأ الدور من قاعدة البيانات (وليس من التوكن)
// حتى لا يبقى صلاحية الأدمن لمن تم تنزيل رتبته أو حذفه.
const adminOnly = async (req, res, next) => {
    try {
        const [rows] = await db.execute('SELECT role FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0 || rows[0].role !== 'admin') {
            return res.status(403).json({ success: false, message: "هذه العملية للمدير فقط" });
        }
        next();
    } catch (err) {
        next(err);
    }
};

const requireAdmin = [protect, adminOnly];

module.exports = { protect, adminOnly, requireAdmin };
