const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // استخراج التوكن
    
    if (!token) return res.status(401).json({ message: "غير مصرح لك بالدخول" });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // حفظ معلومات المستخدم للطلب القادم
        next();
    } catch (err) {
        res.status(403).json({ message: "التوكن غير صالح" });
    }
};

module.exports = protect;