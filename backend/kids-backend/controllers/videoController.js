const db = require('../config/db');

const toIntOrNull = (v) => (v === undefined || v === null || v === '' ? null : Number.parseInt(v, 10) || null);

const youtubeId = (url) => {
    const m = String(url).match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/);
    return m ? m[1] : null;
};

const isHttpUrl = (v) => /^https?:\/\/\S+$/i.test(String(v || '').trim());

// يحدد رابط الفيديو والصورة المصغرة: ملف مرفوع، أو رابط (يوتيوب أو غيره)
const resolveSource = (file, url) => {
    if (file) return { videoUrl: `/uploads/${file.filename}`, thumbnail: null };
    const link = String(url || '').trim();
    if (!isHttpUrl(link)) return null;
    const id = youtubeId(link);
    return { videoUrl: link, thumbnail: id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null };
};

const getAllVideos = async (req, res, next) => {
    try {
        const [rows] = await db.execute('SELECT * FROM videos ORDER BY created_at DESC, id DESC');
        res.status(200).json(rows);
    } catch (error) { next(error); }
};

const getMeta = async (req, res, next) => {
    try {
        const [categories] = await db.execute('SELECT id, name FROM categories ORDER BY id');
        const [ageGroups] = await db.execute('SELECT id, name, min_age, max_age FROM agegroups ORDER BY id');
        res.json({ categories, ageGroups });
    } catch (error) { next(error); }
};

const addVideo = async (req, res, next) => {
    try {
        const { title, url, category_id, age_group_id } = req.body;
        if (!title?.trim()) return res.status(400).json({ success: false, message: "عنوان الفيديو مطلوب" });

        const source = resolveSource(req.file, url);
        if (!source) return res.status(400).json({ success: false, message: "ارفع ملف فيديو أو ضع رابطاً صحيحاً (يبدأ بـ http)" });

        const [result] = await db.execute(
            'INSERT INTO videos (title, url, video_url, thumbnail_url, category_id, age_group_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title.trim(), source.videoUrl, source.videoUrl, source.thumbnail, toIntOrNull(category_id), toIntOrNull(age_group_id)]
        );
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) { next(error); }
};

const deleteVideo = async (req, res, next) => {
    try {
        await db.execute('DELETE FROM videos WHERE id = ?', [req.params.id]);
        res.status(200).json({ success: true, message: "تم الحذف!" });
    } catch (error) { next(error); }
};

const updateVideo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM videos WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: "الفيديو غير موجود" });
        const current = rows[0];

        const { title, url, category_id, age_group_id } = req.body;
        let newUrl = current.url;
        let newVideoUrl = current.video_url;
        let newThumb = current.thumbnail_url;

        if (url !== undefined && url !== '') {
            const source = resolveSource(null, url);
            if (!source) return res.status(400).json({ success: false, message: "الرابط غير صحيح" });
            newUrl = newVideoUrl = source.videoUrl;
            newThumb = source.thumbnail || newThumb;
        }

        await db.execute(
            'UPDATE videos SET title = ?, url = ?, video_url = ?, thumbnail_url = ?, category_id = ?, age_group_id = ? WHERE id = ?',
            [
                title?.trim() || current.title,
                newUrl, newVideoUrl, newThumb,
                category_id === undefined ? current.category_id : toIntOrNull(category_id),
                age_group_id === undefined ? current.age_group_id : toIntOrNull(age_group_id),
                id
            ]
        );
        res.status(200).json({ success: true, message: "تم التعديل!" });
    } catch (error) { next(error); }
};

module.exports = { getAllVideos, getMeta, addVideo, deleteVideo, updateVideo };
