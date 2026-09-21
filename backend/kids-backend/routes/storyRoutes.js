const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAdmin } = require('../middleware/authMiddleware');
const { uploadAudio } = require('../middleware/upload');

const listStories = async (req, res, next) => {
    try {
        const [rows] = await db.query("SELECT * FROM stories ORDER BY id DESC");
        res.json(rows);
    } catch (err) { next(err); }
};

// عام: عرض القصص
router.get('/', listStories);
router.get('/all', listStories);

router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await db.query("SELECT * FROM stories WHERE id = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: "القصة غير موجودة" });
        res.json(rows[0]);
    } catch (err) { next(err); }
});

// للمدير فقط: إضافة قصة مع ملف صوتي
router.post('/', requireAdmin, uploadAudio.single('file'), async (req, res, next) => {
    try {
        const { title, content } = req.body;
        if (!title || !title.trim()) return res.status(400).json({ success: false, message: "عنوان القصة مطلوب" });

        // مسار بشرطة مائلة عادية ليعمل على كل الأنظمة
        const filePath = req.file ? `uploads/${req.file.filename}` : null;

        await db.query("INSERT INTO stories (title, content, file_path) VALUES (?, ?, ?)",
            [title.trim(), content || null, filePath]);

        res.status(201).json({ message: "تمت إضافة القصة مع الملف بنجاح" });
    } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
        await db.query("DELETE FROM stories WHERE id = ?", [req.params.id]);
        res.json({ message: "تم الحذف" });
    } catch (err) { next(err); }
});

module.exports = router;
