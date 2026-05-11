const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

// مسار إضافة قصة مع رفع ملف صوتي
router.post('/', upload.single('file'), async (req, res) => {
    try {
        // --- سطر الكشف عن قاعدة البيانات ---
        const [result] = await db.query("SELECT DATABASE()");
        console.log("السيرفر متصل حالياً بقاعدة بيانات اسمها:", result[0]['DATABASE()']);
        // -----------------------------------

        const { title, content } = req.body;
        const filePath = req.file ? req.file.path : null;

        await db.query("INSERT INTO stories (title, content, file_path) VALUES (?, ?, ?)", 
            [title, content, filePath]);
        
        res.status(201).json({ message: "تمت إضافة القصة مع الملف بنجاح" });
    } catch (err) {
        console.error("خطأ في إضافة القصة:", err);
        res.status(500).json({ error: "خطأ في السيرفر: " + err.message });
    }
});

// باقي المسارات (GET, DELETE) كما هي...
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM stories");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "خطأ" }); }
});

router.get('/all', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM stories");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "خطأ" }); }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM stories WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "القصة غير موجودة" });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: "خطأ" }); }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM stories WHERE id = ?", [id]);
        res.json({ message: "تم الحذف" });
    } catch (err) { res.status(500).json({ error: "خطأ" }); }
});

module.exports = router;