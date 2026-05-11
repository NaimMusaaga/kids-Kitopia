const db = require('../config/db');

// Suggest videos based on age group and exclude already watched videos
exports.getRecommendations = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        // 1. Get user details
        const [userRows] = await db.execute('SELECT age_group_id FROM Users WHERE id = ?', [userId]);
        if (userRows.length === 0) return res.status(404).json({ message: "User not found" });
        
        const ageGroupId = userRows[0].age_group_id;

        // 2. Fetch videos in their age group that they haven't watched
        const [recommendations] = await db.execute(`
            SELECT v.* FROM Videos v
            WHERE v.age_group_id = ? 
            AND v.id NOT IN (SELECT video_id FROM WatchHistory WHERE user_id = ?)
            LIMIT 10
        `, [ageGroupId, userId]);

        res.json(recommendations);
    } catch (error) {
        next(error);
    }
};