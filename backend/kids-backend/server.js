require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
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
app.use(cors());
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

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "Kids Platform API is running perfectly!" });
});

// معالج الأخطاء
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
