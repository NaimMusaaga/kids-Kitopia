const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { parseAge, ageGroupIdFor } = require('../utils/ageGroup');

const register = async (req, res, next) => {
    try {
        const name = req.body?.name?.trim();
        const email = req.body?.email?.trim();
        const password = req.body?.password;
        const hasAge = req.body?.age !== undefined && req.body?.age !== '';
        const age = parseAge(req.body?.age);

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "الاسم والبريد وكلمة السر مطلوبة" });
        }
        if (hasAge && age === null) {
            return res.status(400).json({ success: false, message: "عمر الطفل يجب أن يكون بين 1 و17" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "كلمة السر يجب ألا تقل عن 6 أحرف" });
        }

        const [existing] = await db.execute('SELECT id FROM users WHERE parent_email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: "هذا البريد مسجل مسبقاً" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // عمر الطفل يحدد الفئة العمرية للتوصيات. الدور دائماً 'user'.
        const ageGroupId = age ? await ageGroupIdFor(age) : null;
        await db.execute(
            'INSERT INTO users (name, username, age, age_group_id, parent_email, parent_password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, name, age || 0, ageGroupId, email, hashedPassword, 'user']
        );

        res.status(201).json({ success: true, message: "تم إنشاء الحساب بنجاح!" });
    } catch (error) { next(error); }
};

const login = async (req, res, next) => {
    try {
        const email = req.body?.email?.trim();
        const password = req.body?.password;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "البريد وكلمة السر مطلوبان" });
        }

        const [users] = await db.execute('SELECT * FROM users WHERE parent_email = ?', [email]);
        const user = users[0];

        // نفس الرسالة للحالتين حتى لا نكشف أي البريدات مسجلة
        if (!user || !user.parent_password || !(await bcrypt.compare(password, user.parent_password))) {
            return res.status(401).json({ success: false, message: "البريد أو كلمة السر غير صحيحة" });
        }

        const role = user.role || 'user';
        const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        });

        res.status(200).json({
            success: true,
            token,
            user: { id: user.id, name: user.name, role, age: user.age || 0, age_group_id: user.age_group_id }
        });
    } catch (error) { next(error); }
};

module.exports = { register, login };
