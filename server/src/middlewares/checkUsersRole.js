const {
  MODERATOR_ROLE,
  EMPLOYER_ROLE,
  BEGINNER_ROLE,
} = require('../constants');

module.exports.onlyForModerators = async (req, res, next) => {
  try {
    if (req.user && req.user.role === MODERATOR_ROLE) {
      return next();
    }

    res.status(403).send('Access denied. Moderators only.');
  } catch (err) {
    next(err);
  }
};

module.exports.onlyForEmployers = async (req, res, next) => {
  try {
    if (req.user && req.user.role === EMPLOYER_ROLE) {
      return next();
    }

    res.status(403).send('Access denied. Employers only.');
  } catch (err) {
    next(err);
  }
};

module.exports.onlyForBeginners = async (req, res, next) => {
  try {
    if (req.user && req.user.role === BEGINNER_ROLE) {
      return next();
    }

    res.status(403).send('Access denied. Beginners only.');
  } catch (err) {
    next(err);
  }
};
