const { Router } = require('express');
const { tasksControllers } = require('../controllers');
const {
  authMiddlewares,
  usersRoleMiddlewares,
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
  validationMiddlewares.validation(TaskCreateSchema),
  tasksControllers.createTask
);

tasksRouters.get(
  '/',
  paginateMiddlerawes.paginate,
  tasksControllers.getAllTasks
);

tasksRouters.get('/:taskId', tasksControllers.getTaskById);

tasksRouters.put(
  '/:taskId',
  usersRoleMiddlewares.onlyForModerators,
  validationMiddlewares.validation(TaskUpdateSchema),
  tasksControllers.updateTask
);

tasksRouters.delete(
  '/:taskId',
  usersRoleMiddlewares.onlyForModerators,
  tasksControllers.deleteTask
);

module.exports = tasksRouters;
