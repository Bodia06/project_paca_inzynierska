const { Router } = require('express');
const { payoutControllers } = require('../controllers');
const { authMiddlewares, validationMiddlewares } = require('../middlewares');
const { PayoutSchema } = require('../utils/validationShems');

const payoutRouters = Router();

payoutRouters.use(authMiddlewares.checkToken);

payoutRouters.post(
  '/upBalance',
  validationMiddlewares.validation(PayoutSchema),
  payoutControllers.topUpBalance
);

payoutRouters.post(
  '/withdraw',
  validationMiddlewares.validation(PayoutSchema),
  payoutControllers.withdrawFunds
);

module.exports = payoutRouters;
