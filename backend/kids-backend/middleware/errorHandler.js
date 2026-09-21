const errorHandler = (err, req, res, next) => {
    const status = err.status || (err.name === 'MulterError' ? 400 : 500);

    if (status >= 500) console.error(err.stack);

    res.status(status).json({
        success: false,
        message: status >= 500 ? "خطأ غير متوقع في السيرفر" : err.message,
        // تفاصيل الخطأ تظهر فقط أثناء التطوير
        ...(process.env.NODE_ENV !== 'production' && status >= 500 && { error: err.message })
    });
};

module.exports = errorHandler;
