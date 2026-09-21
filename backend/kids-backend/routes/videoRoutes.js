const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const { uploadVideo } = require('../middleware/upload');
const { getAllVideos, getMeta, addVideo, deleteVideo, updateVideo } = require('../controllers/videoController');

// عام: عرض الفيديوهات
router.get('/', getAllVideos);
router.get('/all', getAllVideos);

// للمدير فقط
router.get('/meta', requireAdmin, getMeta);
router.post('/', requireAdmin, uploadVideo.single('videoFile'), addVideo);
router.put('/:id', requireAdmin, updateVideo);
router.delete('/:id', requireAdmin, deleteVideo);

module.exports = router;
