const { Router } = require('express');
const userRouters = require('./userRouters');
const infoRouters = require('./infoRouters');
const tasksRouters = require('./tasksRouters');
const submissionsRouters = require('./submissionsRouters');
const payoutRouters = require('./payoutRouters');
const solutionRouters = require('./solutionRouters');
const vacancyRouters = require('./vacancyRouters');

const router = Router();

router.use('/user', userRouters);
router.use('/info', infoRouters);
router.use('/tasks', tasksRouters);
router.use('/submissions', submissionsRouters);
router.use('/payout', payoutRouters);
router.use('/solution', solutionRouters);
router.use('/vacancy', vacancyRouters);

module.exports = router;
