const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const { parseAge, ageGroupIdFor } = require('../utils/ageGroup');

// لا نُرجع كلمات السر أبداً
const PUBLIC_COLUMNS = 'id, name, username, age, parent_email, age_group_id, role, created_at';

const listUsers = async (req, res, next) => {
    try {
        const [rows] = await db.query(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY id DESC`);
        res.json(rows);
    } catch (err) { next(err); }
};

// المستخدم الحالي يحدّد/يعدّل عمر الطفل (لتخصيص التوصيات)
router.put('/me/age', protect, async (req, res, next) => {
    try {
        const age = parseAge(req.body && req.body.age);
        if (age === null) return res.status(400).json({ success: false, message: "عمر الطفل يجب أن يكون بين 1 و17" });

        const ageGroupId = await ageGroupIdFor(age);
        await db.query("UPDATE users SET age = ?, age_group_id = ? WHERE id = ?", [age, ageGroupId, req.user.id]);
        res.json({ success: true, age, age_group_id: ageGroupId });
    } catch (err) { next(err); }
});

router.get('/', requireAdmin, listUsers);
router.get('/all', requireAdmin, listUsers);

router.post('/', requireAdmin, async (req, res, next) => {
    try {
        const body = req.body || {};
        const name = body.name && body.name.trim();
        const email = body.parent_email && body.parent_email.trim();
        const password = body.password;
        const role = body.role === 'admin' ? 'admin' : 'user';

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "الاسم والبريد وكلمة السر مطلوبة" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "كلمة السر يجب ألا تقل عن 6 أحرف" });
        }

        const [existing] = await db.query("SELECT id FROM users WHERE parent_email = ?", [email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: "هذا البريد مسجل مسبقاً" });
        }

        const hashed = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO users (name, username, age, parent_email, parent_password, role) VALUES (?, ?, ?, ?, ?, ?)",
            [name, name, 0, email, hashed, role]
        );
        res.status(201).json({ message: "تم إضافة المستخدم بنجاح" });
    } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
        if (String(req.user.id) === String(req.params.id)) {
            return res.status(400).json({ success: false, message: "لا يمكنك حذف حسابك الحالي" });
        }
        await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
        res.json({ message: "تم حذف المستخدم بنجاح" });
    } catch (err) { next(err); }
});

module.exports = router;
