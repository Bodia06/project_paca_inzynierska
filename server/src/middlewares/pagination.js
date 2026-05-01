module.exports.paginate = (req, res, next) => {
  const { limit, offset = 0, all } = req.query;

  if (all === 'true' || all === true) {
    req.pagination = {
      limit: null,
      offset: null,
    };
  } else {
    req.pagination = {
      limit: limit ? Number(limit) : 4,
      offset: Number(offset),
    };
  }
  next();
};
