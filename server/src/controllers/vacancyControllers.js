const { Op } = require('sequelize');
const { Vacancy, User, Solution, sequelize } = require('../database/models');

module.exports.createVacancy = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { body, user } = req;

    if (Number(user.balance) < Number(body.price)) {
      await t.rollback();
      return res.status(400).send('Insufficient funds');
    }

    await user.decrement('balance', { by: body.price, transaction: t });

    const newVacancy = await Vacancy.create(
      { ...body, employerId: user.id, status: 'paid' },
      { transaction: t }
    );

    await t.commit();
    await user.reload();

    res.status(201).send({
      data: newVacancy,
      newBalance: user.balance,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

module.exports.getVacancies = async (req, res, next) => {
  try {
    const { limit = 4, offset = 0 } = req.pagination || {};

    const { title, status, minPrice, myOnly } = req.query;
    const user = req.user;

    const whereCondition = {};

    if (myOnly === 'true') {
      whereCondition.employerId = user.id;

      if (status) {
        whereCondition.status = status;
      }
    } else {
      if (status) {
        whereCondition.status = status;
      } else {
        whereCondition.status = { [Op.or]: ['paid', 'completed'] };
      }
    }

    if (title) {
      whereCondition.title = { [Op.iLike]: `%${title}%` };
    }

    if (minPrice && !isNaN(minPrice)) {
      whereCondition.price = { [Op.gte]: Number(minPrice) };
    }

    const result = await Vacancy.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['displayName', 'avatar'],
        },
        {
          model: Solution,
          as: 'solutions',
          include: [
            {
              model: User,
              as: 'beginner',
              attributes: ['displayName', 'avatar'],
            },
          ],
        },
      ],
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: [
        [
          sequelize.literal(
            `CASE WHEN "Vacancy"."status" = 'paid' THEN 1 ELSE 2 END`
          ),
          'ASC',
        ],
        ['createdAt', 'DESC'],
      ],
      distinct: true,
    });

    const rows = result?.rows || [];
    const count = result?.count || 0;

    res.status(200).send({
      data: rows,
      meta: {
        count,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (err) {
    console.error('VACANCY FETCH ERROR:', err);
    next(err);
  }
};

module.exports.getVacancyById = async (req, res, next) => {
  try {
    const { vacancyId } = req.params;
    const user = req.user;

    const vacancy = await Vacancy.findByPk(vacancyId, {
      include: [
        { model: User, as: 'employer', attributes: ['displayName', 'avatar'] },
        {
          model: Solution,
          as: 'solutions',
          where: user.role === 'beginner' ? { beginnerId: user.id } : {},
          required: false,
          include: [
            {
              model: User,
              as: 'beginner',
              attributes: ['displayName', 'avatar'],
            },
          ],
        },
      ],
    });

    if (!vacancy) return res.status(404).send('Vacancy not found');

    const vacancyData = vacancy.toJSON();

    if (user.role === 'employer' && vacancy.employerId !== user.id) {
      delete vacancyData.solutions;
    }

    res.status(200).send({ data: vacancyData });
  } catch (err) {
    next(err);
  }
};

module.exports.updateVacancy = async (req, res, next) => {
  try {
    const {
      params: { vacancyId },
      body,
      user,
    } = req;
    const vacancy = await Vacancy.findByPk(vacancyId);

    if (!vacancy) return res.status(404).send('Vacancy not found');
    if (vacancy.employerId !== user.id)
      return res.status(403).send('Forbidden');

    await vacancy.update(body);
    res.status(200).send({ data: vacancy });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteVacancy = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      params: { vacancyId },
      user,
    } = req;

    const vacancy = await Vacancy.findByPk(vacancyId, { transaction: t });
    if (!vacancy) {
      await t.rollback();
      return res.status(404).send('Vacancy not found');
    }

    if (vacancy.employerId !== user.id) {
      await t.rollback();
      return res.status(403).send('Access denied');
    }

    await user.increment('balance', { by: vacancy.price, transaction: t });
    await vacancy.destroy({ transaction: t });

    await t.commit();
    await user.reload();

    res.status(200).send({
      id: vacancyId,
      newBalance: user.balance,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
