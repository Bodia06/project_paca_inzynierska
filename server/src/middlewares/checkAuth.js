const TokenError = require('./errors/TokenError');
const { User } = require('../database/models');
const { verifyToken } = require('../services/tokenService');

module.exports.checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(new TokenError('No token'));

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) return next(new TokenError('User not found'));

    req.user = user;
    next();
  } catch (err) {
    next(new TokenError('Invalid token'));
  }
};
