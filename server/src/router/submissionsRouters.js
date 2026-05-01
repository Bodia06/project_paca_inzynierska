const { Router } = require('express');
const { submissionsControllers } = require('../controllers');
const {
  authMiddlewares,
  usersRoleMiddlewares,
  validationMiddlewares,
  paginateMiddlerawes,
} = require('../middlewares');
const {
  SubmissionCreateSchema,
  SubmissionGradeSchema,
} = require('../utils/validationShems');

const submissionsRouters = Router();

submissionsRouters.use(authMiddlewares.checkToken);

submissionsRouters.post(
  '/',
  usersRoleMiddlewares.onlyForBeginners,
  validationMiddlewares.validation(SubmissionCreateSchema),
  submissionsControllers.createSubmission
);

submissionsRouters.get(
  '/my-grades',
  usersRoleMiddlewares.onlyForBeginners,
  submissionsControllers.getMyGrades
);

submissionsRouters.get(
  '/pending',
  usersRoleMiddlewares.onlyForModerators,
  paginateMiddlerawes.paginate,
  submissionsControllers.getPendingSubmissions
);

submissionsRouters.patch(
  '/:submissionId/grade',
  usersRoleMiddlewares.onlyForModerators,
  validationMiddlewares.validation(SubmissionGradeSchema),
  submissionsControllers.gradeSubmission
);

module.exports = submissionsRouters;
