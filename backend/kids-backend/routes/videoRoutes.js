const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const { uploadVideo } = require('../middleware/upload');
const { getAllVideos, getMeta, addVideo, deleteVideo, updateVideo } = require('../controllers/videoController');

// عام: عرض الفيديوهات
router.get('/', getAllVideos);
router.get('/all', getAllVideos);

// للمستخدم المسجّل: سجل المشاهدة
router.get('/history', protect, async (req, res, next) => {
    try {
        const [rows] = await db.execute(`
            SELECT v.* FROM watchhistory w
              JOIN videos v ON v.id = w.video_id
             WHERE w.user_id = ?
             ORDER BY w.watched_at DESC, w.id DESC
             LIMIT 10
        `, [req.user.id]);
        res.json(rows);
    } catch (err) { next(err); }
});

router.post('/:id/watch', protect, async (req, res, next) => {
    try {
        const [videos] = await db.execute('SELECT id FROM videos WHERE id = ?', [req.params.id]);
        if (videos.length === 0) return res.status(404).json({ success: false, message: "الفيديو غير موجود" });

        // سطر واحد لكل فيديو (يتحدث وقت آخر مشاهدة)
        await db.execute('DELETE FROM watchhistory WHERE user_id = ? AND video_id = ?', [req.user.id, req.params.id]);
        await db.execute('INSERT INTO watchhistory (user_id, video_id) VALUES (?, ?)', [req.user.id, req.params.id]);
        res.json({ success: true });
    } catch (err) { next(err); }
});

// للمدير فقط
router.get('/meta', requireAdmin, getMeta);
router.post('/', requireAdmin, uploadVideo.single('videoFile'), addVideo);
router.put('/:id', requireAdmin, updateVideo);
router.delete('/:id', requireAdmin, deleteVideo);

module.exports = router;
