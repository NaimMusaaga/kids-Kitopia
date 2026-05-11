const express = require('express');
const router = express.Router();
// استدعاء المتحكم الذي يحتوي على خوارزمية التوصيات
const recommendController = require('../controllers/recommendController');

// تعريف المسار: سيتم الوصول إليه عبر /api/recommendations/:userId
// حيث أن :userId هو متغير يمثل رقم تعريف الطفل في قاعدة البيانات
router.get('/:userId', recommendController.getRecommendations);

module.exports = router;