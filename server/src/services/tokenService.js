const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../constants');

module.exports.createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

module.exports.verifyToken = (token) => jwt.verify(token, JWT_SECRET);
