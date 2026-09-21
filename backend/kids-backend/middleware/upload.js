const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const makeUploader = (prefix, mimePrefix, maxMB) => multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => cb(null, `${prefix}${Date.now()}${path.extname(file.originalname).toLowerCase()}`)
    }),
    limits: { fileSize: maxMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith(mimePrefix)) return cb(null, true);
        const err = new Error(`نوع الملف غير مسموح (المطلوب ${mimePrefix}*)`);
        err.status = 400;
        cb(err);
    }
});

module.exports = {
    uploadVideo: makeUploader('vid-', 'video/', 500),
    uploadAudio: makeUploader('', 'audio/', 100)
};
