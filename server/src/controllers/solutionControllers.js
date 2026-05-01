const { Op } = require('sequelize');
const { Solution, Vacancy, User, sequelize } = require('../database/models');

module.exports.createSolution = async (req, res, next) => {
  try {
    const { vacancyId, githubLink } = req.body;
    const userId = req.user.id;

    const vacancy = await Vacancy.findByPk(vacancyId);
    if (!vacancy || vacancy.status !== 'paid') {
      return res.status(400).send('Vacancy is not available for submissions');
    }

    const newSolution = await Solution.create({
      vacancyId,
      githubLink,
      beginnerId: userId,
      status: 'pending',
    });

    res.status(201).send(newSolution);
  } catch (err) {
    next(err);
  }
};

module.exports.acceptSolution = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { solutionId } = req.params;
    const userId = req.user.id;

    const solution = await Solution.findByPk(solutionId, {
      include: [{ model: Vacancy, as: 'vacancy' }],
      transaction: t,
    });

    if (!solution || solution.status !== 'pending') {
      await t.rollback();
      return res.status(400).send('Solution not found or already processed');
    }

    if (solution.vacancy.employerId !== userId) {
      await t.rollback();
      return res.status(403).send('Access denied');
    }

    await solution.update({ status: 'accepted' }, { transaction: t });

    await Solution.update(
      { status: 'rejected' },
      {
        where: {
          vacancyId: solution.vacancyId,
          status: 'pending',
          id: { [Op.ne]: solution.id },
        },
        transaction: t,
      }
    );

    await Vacancy.update(
      { status: 'completed' },
      { where: { id: solution.vacancyId }, transaction: t }
    );

    const beginner = await User.findByPk(solution.beginnerId, {
      transaction: t,
    });
    await beginner.increment('balance', {
      by: solution.vacancy.price,
      transaction: t,
    });

    await t.commit();
    await beginner.reload();

    res.send({
      message: 'Solution accepted. Others rejected. Payout completed.',
      newBalance: beginner.balance,
      solutionId,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

module.exports.rejectSolution = async (req, res, next) => {
  try {
    const { solutionId } = req.params;
    const userId = req.user.id;

    const solution = await Solution.findByPk(solutionId, {
      include: [{ model: Vacancy, as: 'vacancy' }],
    });

    if (!solution) return res.status(404).send('Solution not found');
    if (solution.vacancy.employerId !== userId)
      return res.status(403).send('Forbidden');

    if (solution.status !== 'pending')
      return res.status(400).send('Already processed');

    await solution.update({ status: 'rejected' });
    res.send({ message: 'Solution rejected', solutionId });
  } catch (err) {
    next(err);
  }
};

module.exports.updateSolution = async (req, res, next) => {
  try {
    const {
      params: { solutionId },
      body,
      user,
    } = req;
    const solution = await Solution.findByPk(solutionId);

    if (!solution) return res.status(404).send('Solution not found');
    if (solution.beginnerId !== user.id)
      return res.status(403).send('Access denied');

    if (solution.status !== 'pending') {
      return res.status(400).send('Cannot edit processed solution');
    }

    await solution.update({ githubLink: body.githubLink });
    res.status(200).send(solution);
  } catch (err) {
    next(err);
  }
};
