const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const recommendController = require('../controllers/recommendController');

// /api/recommend/:userId — :userId هو رقم الطفل في قاعدة البيانات
router.get('/:userId', protect, recommendController.getRecommendations);

module.exports = router;
