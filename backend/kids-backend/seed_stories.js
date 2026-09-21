require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const directoryPath = path.join(__dirname, 'public'); // المجلد الذي يحتوي الأصوات

fs.readdir(directoryPath, async (err, files) => {
    if (err) return console.log('خطأ في قراءة المجلد: ' + err);

    const mp3Files = files.filter(file => file.endsWith('.mp3'));

    for (const file of mp3Files) {
        try {
            // لا نكرر القصة إذا كان ملفها مسجلاً من قبل
            const [existing] = await db.query("SELECT id FROM stories WHERE audio_path = ?", [file]);
            if (existing.length > 0) {
                console.log(`موجودة مسبقاً: ${file}`);
                continue;
            }

            const title = file.replace('.mp3', '').replace(/_/g, ' ');
            await db.query(
                "INSERT INTO stories (title, audio_path) VALUES (?, ?)",
                [title, file]
            );
            console.log(`تمت إضافة: ${file}`);
        } catch (error) {
            console.error(`خطأ في إضافة ${file}:`, error);
        }
    }
    console.log("انتهت العملية بنجاح!");
    process.exit();
});
