const { Router } = require('express');
const {
  validationMiddlewares,
  authMiddlewares,
  usersRoleMiddlewares,
  uploadMiddlewares,
  paginateMiddlerawes,
} = require('../middlewares');
const { infoControllers } = require('../controllers');
const {
  InfoCreateSchema,
  InfoUpdateSchema,
} = require('../utils/validationShems');

const infoRouters = Router();

infoRouters.use(authMiddlewares.checkToken);

infoRouters.post(
  '/',
  usersRoleMiddlewares.onlyForModerators,
  uploadMiddlewares.uploadInfoImage,
  validationMiddlewares.validation(InfoCreateSchema),
  infoControllers.createInfo
);

infoRouters.get('/', paginateMiddlerawes.paginate, infoControllers.getInfo);

infoRouters.get('/:infoId', infoControllers.getInfoById);

infoRouters.put(
  '/:infoId',
  usersRoleMiddlewares.onlyForModerators,
  uploadMiddlewares.uploadInfoImage,
  validationMiddlewares.validation(InfoUpdateSchema),
  infoControllers.updateInfo
);

infoRouters.delete(
  '/:infoId',
  usersRoleMiddlewares.onlyForModerators,
  infoControllers.deleteInfo
);

module.exports = infoRouters;
