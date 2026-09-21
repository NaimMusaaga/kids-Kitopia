const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAdmin } = require('../middleware/authMiddleware');

// إحصائيات لوحة التحكم (للمدير فقط)
router.get('/stats', requireAdmin, async (req, res, next) => {
    try {
        const [videos] = await db.query("SELECT COUNT(*) as count FROM videos");
        const [users] = await db.query("SELECT COUNT(*) as count FROM users");
        const [stories] = await db.query("SELECT COUNT(*) as count FROM stories");

        res.json({
            videoCount: videos[0].count,
            userCount: users[0].count,
            storyCount: stories[0].count
        });
    } catch (err) { next(err); }
});

module.exports = router;
