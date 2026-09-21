require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const errorHandler = require('./middleware/errorHandler');

// استيراد كافة الـ Routes
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const recommendRoutes = require('./routes/recommendRoutes');
const userRoutes = require('./routes/userRoutes');
const storyRoutes = require('./routes/storyRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET غير موجود. انسخ .env.example إلى .env وضع فيه قيمة سرية.');
    process.exit(1);
}

const app = express();

// Middleware
// CORS_ORIGIN اختياري (عند نشر الواجهة على دومين مختلف)؛ الافتراضي يسمح للجميع
app.use(cors(process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN.split(',') } : undefined));
app.use(express.json());

// ملفات القصص الصوتية الجاهزة
app.use('/public', express.static(path.join(__dirname, 'public')));

// الملفات المرفوعة من لوحة التحكم (فيديوهات وقصص صوتية)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// الربط مع كافة المسارات (Endpoints)
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/dashboard', dashboardRoutes);

// عند وجود نسخة الواجهة المبنية (npm run build) يخدمها نفس السيرفر، فيكفي نشر خدمة واحدة
const distPath = path.join(__dirname, '..', '..', 'frontend', 'kids-frontend', 'dist');
const hasFrontend = fs.existsSync(path.join(distPath, 'index.html'));

if (hasFrontend) {
    app.use(express.static(distPath));
} else {
    app.get('/', (req, res) => {
        res.json({ message: "Kids Platform API is running perfectly!" });
    });
}

// أي مسار غير API يعود لصفحة React (للتنقل داخل الموقع)
if (hasFrontend) {
    app.get('/{*splat}', (req, res, next) => {
        if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/') || req.path.startsWith('/public/')) return next();
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// معالج الأخطاء
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
