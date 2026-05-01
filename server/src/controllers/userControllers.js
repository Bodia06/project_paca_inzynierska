const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { User } = require('../database/models');
const { createToken } = require('../services/tokenService');

module.exports.userRegistration = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, displayName, role } =
      req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError(409, 'User with this email already exists');
    }

    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      displayName,
      role,
    });

    const accessToken = createToken({ userId: newUser.id, role: newUser.role });

    const { password: _, ...userResponse } = newUser.get({ plain: true });

    res.status(201).json({
      success: true,
      user: userResponse,
      token: accessToken,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(400, 'Email and password are required');
    }

    const foundUser = await User.findOne({ where: { email } });

    const authError = createError(401, 'Invalid email or password');

    if (!foundUser) return next(authError);

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) return next(authError);

    const accessToken = createToken({ userId: foundUser.id });

    const { password: _, ...userResponse } = foundUser.get({ plain: true });

    res.status(200).json({
      success: true,
      user: userResponse,
      token: accessToken,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    if (!req.user) {
      throw createError(404, 'User session not found');
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.userUpdate = async (req, res, next) => {
  try {
    const userId = req.tokenPayload?.userId || req.user?.id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.avatar = req.file.filename;
    }

    await User.update(updateData, {
      where: { id: userId },
    });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      plain: true,
    });

    if (!updatedUser) {
      throw createError(404, 'User not found');
    }

    const userResponse = updatedUser.get({ plain: true });

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
