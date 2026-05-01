const { Router } = require('express');
const { vacancyControllers } = require('../controllers');
const {
  authMiddlewares,
  usersRoleMiddlewares,
  paginateMiddlerawes,
  validationMiddlewares,
} = require('../middlewares');
const {
  VacancyCreateSchema,
  VacancyUpdateSchema,
} = require('../utils/validationShems');

const vacancyRouters = Router();

vacancyRouters.use(authMiddlewares.checkToken);

vacancyRouters.post(
  '/',
  usersRoleMiddlewares.onlyForEmployers,
  validationMiddlewares.validation(VacancyCreateSchema),
  vacancyControllers.createVacancy
);

vacancyRouters.get(
  '/',
  paginateMiddlerawes.paginate,
  vacancyControllers.getVacancies
);

vacancyRouters.get('/:vacancyId', vacancyControllers.getVacancyById);

vacancyRouters.patch(
  '/:vacancyId',
  usersRoleMiddlewares.onlyForEmployers,
  validationMiddlewares.validation(VacancyUpdateSchema),
  vacancyControllers.updateVacancy
);

vacancyRouters.delete(
  '/:vacancyId',
  usersRoleMiddlewares.onlyForEmployers,
  vacancyControllers.deleteVacancy
);

module.exports = vacancyRouters;
