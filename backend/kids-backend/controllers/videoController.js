const db = require('../config/db');

const getAllVideos = async (req, res, next) => {
    try {
        const [rows] = await db.execute('SELECT * FROM videos');
        res.status(200).json(rows); 
    } catch (error) { next(error); }
};

const addVideo = async (req, res, next) => {
    try {
        const { title, category_id, age_group_id, url } = req.body;
        
        // المنطق الذكي: إذا كان هناك ملف مرفوع، استخدم مساره، وإلا استخدم الرابط النصي
        const finalUrl = req.file ? req.file.path : url;

        const [result] = await db.execute(
            'INSERT INTO videos (title, url, category_id, age_group_id) VALUES (?, ?, ?, ?)', 
            [title, finalUrl, category_id, age_group_id]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) { next(error); }
};

const deleteVideo = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM videos WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: "تم الحذف!" });
    } catch (error) { next(error); }
};

const updateVideo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, url, category_id, age_group_id } = req.body;
        await db.execute(
            'UPDATE videos SET title = ?, url = ?, category_id = ?, age_group_id = ? WHERE id = ?', 
            [title, url, category_id, age_group_id, id]
        );
        res.status(200).json({ success: true, message: "تم التعديل!" });
    } catch (error) { next(error); }
};

module.exports = { getAllVideos, addVideo, deleteVideo, updateVideo };