const { Router } = require('express');
const { tasksControllers } = require('../controllers');
const {
  authMiddlewares,
  usersRoleMiddlewares,
  normalizeTaskModuleMiddlewares,
  validationMiddlewares,
  paginateMiddlerawes,
} = require('../middlewares');
const {
  TaskCreateSchema,
  TaskUpdateSchema,
} = require('../utils/validationShems');

const tasksRouters = Router();

tasksRouters.use(authMiddlewares.checkToken);

tasksRouters.post(
  '/',
  usersRoleMiddlewares.onlyForModerators,
  normalizeTaskModuleMiddlewares.normalizeTaskModule,
  validationMiddlewares.validation(TaskCreateSchema),
  tasksControllers.createTask
);

tasksRouters.get(
  '/',
  paginateMiddlerawes.paginate,
  normalizeTaskModuleMiddlewares.normalizeTaskModule,
  tasksControllers.getAllTasks
);

tasksRouters.get('/:taskId', tasksControllers.getTaskById);

tasksRouters.put(
  '/:taskId',
  usersRoleMiddlewares.onlyForModerators,
  normalizeTaskModuleMiddlewares.normalizeTaskModule,
  validationMiddlewares.validation(TaskUpdateSchema),
  tasksControllers.updateTask
);

tasksRouters.delete(
  '/:taskId',
  usersRoleMiddlewares.onlyForModerators,
  tasksControllers.deleteTask
);

module.exports = tasksRouters;
