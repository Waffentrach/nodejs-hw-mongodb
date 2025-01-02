export default (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
};
