module.exports.errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    err.code = 400;
  }

  const status = err.code || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ error: message });
};
