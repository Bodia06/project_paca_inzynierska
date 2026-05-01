const { Router } = require('express');
const {
  hashPasswordMiddlewares,
  validationMiddlewares,
  authMiddlewares,
  uploadMiddlewares,
} = require('../middlewares');
const {
  UserRegistrationSchema,
  UserLoginSchema,
  UserUpdateSchema,
} = require('../utils/validationShems');
const { userControllers } = require('../controllers');

const userRouters = Router();

userRouters.post(
  '/registration',
  validationMiddlewares.validation(UserRegistrationSchema),
  hashPasswordMiddlewares.hashPassword,
  userControllers.userRegistration
);

userRouters.post(
  '/login',
  validationMiddlewares.validation(UserLoginSchema),
  userControllers.userLogin
);

userRouters.get(
  '/getUser',
  authMiddlewares.checkToken,
  userControllers.getUser
);

userRouters.put(
  '/updateUser',
  authMiddlewares.checkToken,
  uploadMiddlewares.uploadAvatar,
  validationMiddlewares.validation(UserUpdateSchema),
  userControllers.userUpdate
);

module.exports = userRouters;
