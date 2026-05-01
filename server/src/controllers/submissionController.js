const createError = require('http-errors');
const { Submission, Task, User } = require('../database/models');

module.exports.createSubmission = async (req, res, next) => {
  try {
    const {
      body: { taskId, githubUrl },
      user: { id },
    } = req;

    const submission = await Submission.create({
      taskId,
      userId: id,
      githubUrl,
    });

    res.status(201).send(submission);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return next(
        createError(409, 'You have already submitted a solution for this task')
      );
    }
    next(err);
  }
};

module.exports.getMyGrades = async (req, res, next) => {
  try {
    const {
      user: { id },
    } = req;

    const myWorks = await Submission.findAll({
      where: { userId: id },
      include: [
        {
          model: Task,
          as: 'task',
          attributes: ['modul', 'title'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    res.send(myWorks);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.getPendingSubmissions = async (req, res, next) => {
  try {
    const { limit, offset } = req.pagination;

    const { count, rows: submissions } = await Submission.findAndCountAll({
      where: { grade: null },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['firstName', 'lastName', 'email', 'avatar'],
        },
        {
          model: Task,
          as: 'task',
          attributes: ['title'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'ASC']],
    });

    res.send({ submissions, count });
  } catch (err) {
    next(err);
  }
};

module.exports.gradeSubmission = async (req, res, next) => {
  try {
    const {
      params: { submissionId },
      body: { grade, feedback },
    } = req;

    const submission = await Submission.findByPk(submissionId);

    if (!submission) {
      return next(createError(404, 'Submission not found'));
    }

    await submission.update({ grade, feedback });

    res.send({
      message: 'Grade successfully assigned',
      submission,
    });
  } catch (err) {
    next(err);
  }
};
