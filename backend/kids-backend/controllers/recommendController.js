const db = require('../config/db');

// يقترح فيديوهات من نفس الفئة العمرية للطفل ويستثني ما شاهده سابقاً
exports.getRecommendations = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // كل مستخدم يرى توصياته فقط (إلا المدير)
        if (String(req.user.id) !== String(userId) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "غير مسموح" });
        }

        const [userRows] = await db.execute('SELECT age_group_id FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) return res.status(404).json({ message: "User not found" });

        const [recommendations] = await db.execute(`
            SELECT v.* FROM videos v
            WHERE v.age_group_id = ?
            AND v.id NOT IN (SELECT video_id FROM watchhistory WHERE user_id = ? AND video_id IS NOT NULL)
            LIMIT 10
        `, [userRows[0].age_group_id, userId]);

        res.json(recommendations);
    } catch (error) {
        next(error);
    }
};
