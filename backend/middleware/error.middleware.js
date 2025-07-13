// backend/src/middleware/errorMiddleware.js
export const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Sunucu hatası',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
