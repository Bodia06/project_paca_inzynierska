const { Router } = require('express');
const { solutionControllers } = require('../controllers');
const {
  authMiddlewares,
  usersRoleMiddlewares,
  validationMiddlewares,
} = require('../middlewares');
const {
  SolutionCreateSchema,
  SolutionUpdateSchema,
} = require('../utils/validationShems');

const solutionRouters = Router();

solutionRouters.use(authMiddlewares.checkToken);

solutionRouters.post(
  '/',
  usersRoleMiddlewares.onlyForBeginners,
  validationMiddlewares.validation(SolutionCreateSchema),
  solutionControllers.createSolution
);

solutionRouters.patch(
  '/:solutionId',
  usersRoleMiddlewares.onlyForBeginners,
  validationMiddlewares.validation(SolutionUpdateSchema),
  solutionControllers.updateSolution
);

solutionRouters.post(
  '/:solutionId/accept',
  usersRoleMiddlewares.onlyForEmployers,
  solutionControllers.acceptSolution
);

solutionRouters.post(
  '/:solutionId/reject',
  usersRoleMiddlewares.onlyForEmployers,
  solutionControllers.rejectSolution
);

module.exports = solutionRouters;
