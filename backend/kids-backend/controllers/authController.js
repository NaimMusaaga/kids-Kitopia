const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        // تشفير كلمة السر
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // قمنا بمطابقة الحقول مع جدول قاعدة البيانات الذي أرسلته (name, username, age, parent_email, parent_password)
        const query = 'INSERT INTO users (name, username, age, parent_email, parent_password) VALUES (?, ?, ?, ?, ?)';
        
        // نستخدم 'name' كـ username، ورقم 0 كقيمة افتراضية لـ age لأن الجدول يطلبها
        await db.execute(query, [name, name, 0, email, hashedPassword]);
        
        res.status(201).json({ success: true, message: "تم إنشاء الحساب بنجاح!" });
    } catch (error) {
        console.error("خطأ في التسجيل:", error);
        res.status(500).json({ success: false, message: "حدث خطأ في قاعدة البيانات" });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // البحث عن المستخدم باستخدام parent_email
        const [users] = await db.execute('SELECT * FROM users WHERE parent_email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "البريد الإلكتروني غير موجود" });
        }
        
        const user = users[0];
        // مقارنة كلمة السر مع parent_password
        const isMatch = await bcrypt.compare(password, user.parent_password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "كلمة السر خاطئة" });
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ 
            success: true, 
            token, 
            user: { id: user.id, name: user.name } 
        });
    } catch (error) {
        console.error("خطأ في تسجيل الدخول:", error);
        res.status(500).json({ success: false, message: "حدث خطأ في السيرفر" });
    }
};

module.exports = { register, login };