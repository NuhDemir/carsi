// backend/src/middleware/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  // Eğer handler çağırılmadan önce status atanmadıysa default 500
  const statusCode =
    err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  // Log hata (sunucu tarafında takip için)
  console.error(err);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Sunucu hatası",
    // Geliştirme ortamında stack trace dönüyoruz, prod'da gizliyoruz
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
  // next kullanılmıyor ama parametre bırakıyoruz express uyumluluğu için
  if (next) next();
};
