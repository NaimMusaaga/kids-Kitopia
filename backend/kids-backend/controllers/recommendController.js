const db = require('../config/db');

// توصيات مخصصة للطفل:
//  1) فيديوهات فئته العمرية أولاً (وتُستبعد فيديوهات الفئات الأخرى)
//  2) ثم الفئات (categories) التي يشاهدها أكثر
//  3) ثم فيديوهات عامة غير مخصصة لفئة معينة، والأحدث أولاً
// وتُستثنى الفيديوهات التي شاهدها مسبقاً.
exports.getRecommendations = async (req, res, next) => {
    try {
        const userId = req.params.userId === 'me' ? req.user.id : req.params.userId;

        // كل مستخدم يرى توصياته فقط (إلا المدير)
        if (String(req.user.id) !== String(userId) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "غير مسموح" });
        }

        const [userRows] = await db.execute('SELECT age_group_id FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) return res.status(404).json({ message: "User not found" });

        const groupId = userRows[0].age_group_id; // قد تكون null (لم يحدد العمر)

        const [recommendations] = await db.execute(`
            SELECT v.*,
                   (v.age_group_id IS NOT NULL AND v.age_group_id = ?) AS match_age,
                   (SELECT COUNT(*) FROM watchhistory w
                      JOIN videos wv ON wv.id = w.video_id
                     WHERE w.user_id = ? AND wv.category_id IS NOT NULL AND wv.category_id = v.category_id) AS category_score
              FROM videos v
             WHERE v.id NOT IN (SELECT video_id FROM watchhistory WHERE user_id = ? AND video_id IS NOT NULL)
               AND (? IS NULL OR v.age_group_id IS NULL OR v.age_group_id = ?)
             ORDER BY match_age DESC, category_score DESC, v.created_at DESC, v.id DESC
             LIMIT 8
        `, [groupId, userId, userId, groupId, groupId]);

        res.json(recommendations);
    } catch (error) {
        next(error);
    }
};
