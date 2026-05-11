const express = require('express');
const router = express.Router();
const db = require('../config/db'); // تأكد من المسار الصحيح لقاعدة البيانات

// جلب إحصائيات الداشبورد
router.get('/stats', async (req, res) => {
    try {
        const [videos] = await db.query("SELECT COUNT(*) as count FROM videos");
        const [users] = await db.query("SELECT COUNT(*) as count FROM users");
        const [stories] = await db.query("SELECT COUNT(*) as count FROM stories");
        
        res.json({
            videoCount: videos[0].count,
            userCount: users[0].count,
            storyCount: stories[0].count
        });
    } catch (err) {
        console.error("خطأ في جلب الإحصائيات:", err);
        res.status(500).json({ error: "خطأ في جلب البيانات" });
    }
});

module.exports = router;