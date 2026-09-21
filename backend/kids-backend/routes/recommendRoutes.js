const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const recommendController = require('../controllers/recommendController');

// /api/recommend/me — توصيات المستخدم الحالي
// /api/recommend/:userId — للمدير أو لصاحب الحساب نفسه
router.get('/:userId', protect, recommendController.getRecommendations);

module.exports = router;
