const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllVideos, addVideo, deleteVideo, updateVideo } = require('../controllers/videoController');

// إعداد Multer لحفظ الفيديوهات
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // تأكد أن هذا المجلد موجود
    },
    filename: (req, file, cb) => {
        cb(null, 'vid-' + Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// 1. مسار جلب كل الفيديوهات
router.get('/', getAllVideos);
router.get('/all', getAllVideos);

// 2. مسار إضافة فيديو جديد (مع إضافة وسيط الرفع)
// لاحظ أننا استخدمنا upload.single('videoFile')
router.post('/', upload.single('videoFile'), addVideo);

// 3. مسار حذف فيديو
router.delete('/:id', deleteVideo);

// 4. مسار تعديل فيديو
router.put('/:id', updateVideo);

module.exports = router;