const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { SALT_ROUNDS } = require('../constants');

module.exports.hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return next(createError(400, 'A valid password string is required'));
    }

    req.body.password = await bcrypt.hash(password, SALT_ROUNDS);

    next();
  } catch (err) {
    next(err);
  }
};
