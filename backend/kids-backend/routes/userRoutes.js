const express = require('express');
const router = express.Router();
const db = require('../config/db'); // تأكد من مسار الداتابيس

// 1. مسار جلب جميع المستخدمين (للموقع الأساسي)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM users");
        res.json(rows);
    } catch (err) {
        console.error("خطأ في جلب المستخدمين:", err);
        res.status(500).json({ error: "خطأ في السيرفر" });
    }
});

// 2. مسار جلب جميع المستخدمين (للداشبورد - الحل للـ 404)
router.get('/all', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM users");
        res.json(rows);
    } catch (err) {
        console.error("خطأ في جلب المستخدمين (all):", err);
        res.status(500).json({ error: "خطأ في السيرفر" });
    }
});

// 3. مسار إضافة مستخدم جديد
router.post('/', async (req, res) => {
    try {
        const { name, parent_email, password, role } = req.body;
        // إضافة مستخدم جديد (ملاحظة: تأكد من تشفير كلمة السر في مرحلة الإنتاج)
        await db.query("INSERT INTO users (name, parent_email, password, role) VALUES (?, ?, ?, ?)", 
            [name, parent_email, password, role]);
        res.status(201).json({ message: "تم إضافة المستخدم بنجاح" });
    } catch (err) {
        console.error("خطأ في إضافة المستخدم:", err);
        res.status(500).json({ error: "خطأ في السيرفر" });
    }
});

// 4. مسار حذف مستخدم
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM users WHERE id = ?", [id]);
        res.json({ message: "تم حذف المستخدم بنجاح" });
    } catch (err) {
        console.error("خطأ في حذف المستخدم:", err);
        res.status(500).json({ error: "خطأ في السيرفر" });
    }
});

module.exports = router;