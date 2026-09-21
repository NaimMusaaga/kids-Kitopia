# Kitopia — منصة أطفال (فيديوهات + قصص صوتية + ألعاب)

- **frontend/kids-frontend**: React 19 + Vite (الواجهة بالتركية، متجاوبة مع كل الشاشات)
- **backend/kids-backend**: Express 5 + MySQL + JWT
- **database/kids_platform.sql**: هيكل وبيانات قاعدة البيانات

## التشغيل محلياً

1. استورد `database/kids_platform.sql` في MySQL (XAMPP → phpMyAdmin).
2. الباك اند:
   ```bash
   cd backend/kids-backend
   cp .env.example .env      # ثم غيّر JWT_SECRET إلى نص عشوائي طويل
   npm install
   npm run dev               # http://localhost:5000
   ```
3. الفرونت اند (يقرأ عنوان الباك اند من `VITE_API_URL`، والافتراضي `http://localhost:5000`):
   ```bash
   cd frontend/kids-frontend
   npm install
   npm run dev
   ```

## إنشاء حساب مدير

سجّل حساباً عادياً من الموقع، ثم اجعله مديراً:

```bash
cd backend/kids-backend
npm run make-admin -- your@email.com
```

بعدها تسجيل الدخول بهذا الحساب يفتح لوحة التحكم `/dashboard`.

## إضافة فيديو

من لوحة التحكم → **Videolar** → الصق رابط يوتيوب. يُعرض الفيديو داخل الموقع (نافذة تشغيل مدمجة) ولا يغادر الزائر الموقع.
تأكد أن خيار **"Allow embedding / السماح بالتضمين"** مفعّل للفيديو في YouTube Studio.
