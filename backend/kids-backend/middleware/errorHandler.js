const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: "خطأ غير متوقع في السيرفر",
        error: err.message 
    });
};

module.exports = errorHandler;