const fs = require('fs');
const path = require('path');
const db = require('./config/db'); // تأكد من مسار ملف قاعدة البيانات الخاص بك

const directoryPath = path.join(__dirname, 'public'); // المجلد الذي يحتوي الأصوات

fs.readdir(directoryPath, async (err, files) => {
    if (err) return console.log('خطأ في قراءة المجلد: ' + err);

    // فلترة الملفات لاختيار mp3 فقط
    const mp3Files = files.filter(file => file.endsWith('.mp3'));

    for (const file of mp3Files) {
        try {
            // تنظيف اسم الملف ليكون عنواناً جميلاً (مثلاً: msw023_01 -> القصة 01)
            const title = file.replace('.mp3', '').replace(/_/g, ' '); 
            
            // إدخال البيانات في القاعدة
            await db.query(
                "INSERT IGNORE INTO stories (title, audio_path, thumbnail_url) VALUES (?, ?, ?)",
                [title, file, 'https://via.placeholder.com/300'] // صورة افتراضية
            );
            console.log(`تمت إضافة: ${file}`);
        } catch (error) {
            console.error(`خطأ في إضافة ${file}:`, error);
        }
    }
    console.log("انتهت العملية بنجاح!");
    process.exit();
});