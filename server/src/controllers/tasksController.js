const createError = require('http-errors');
const { Op } = require('sequelize');
const { Submission, Task, User } = require('../database/models');

module.exports.createTask = async (req, res, next) => {
  try {
    const { body, user } = req;

    if (!body || Object.keys(body).length === 0) {
      return next(createError(400, 'Task data is required'));
    }

    const newTask = await Task.create({
      ...body,
      creatorId: user.id,
    });

    res.status(201).send(newTask);
  } catch (err) {
    next(err);
  }
};

module.exports.getAllTasks = async (req, res, next) => {
  try {
    const { modul, title } = req.query;
    const { limit, offset } = req.pagination;

    const where = {};
    if (modul) where.modul = modul;
    if (title) where.title = { [Op.iLike]: `%${title}%` };

    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      limit: limit || undefined,
      offset: offset || 0,
      include: [
        {
          model: User,
          as: 'moderator',
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).send({
      data: tasks,
      meta: {
        count: Number(count),
        limit: limit ? Number(limit) : null,
        offset: Number(offset),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getTaskById = async (req, res, next) => {
  try {
    const {
      params: { taskId },
    } = req;

    if (isNaN(taskId)) {
      return next(createError(400, 'Invalid Task ID format'));
    }

    const task = await Task.findByPk(taskId, {
      include: {
        model: User,
        as: 'moderator',
        attributes: ['firstName', 'lastName'],
      },
    });

    if (!task) {
      return next(createError(404, 'Task not found'));
    }

    res.send(task);
  } catch (err) {
    next(err);
  }
};

module.exports.updateTask = async (req, res, next) => {
  try {
    const {
      params: { taskId },
      body,
      user: { id: userId },
    } = req;

    if (isNaN(taskId)) {
      return next(createError(400, 'Invalid Task ID'));
    }

    const [updatedCount, updatedRows] = await Task.update(body, {
      where: {
        id: taskId,
        creatorId: userId,
      },
      returning: true,
    });

    if (updatedCount === 0) {
      const taskExists = await Task.findByPk(taskId);
      if (!taskExists) {
        return next(createError(404, 'Task not found'));
      }
      return next(createError(403, 'You are not allowed to update this task'));
    }

    res.send(updatedRows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTask = async (req, res, next) => {
  try {
    const {
      params: { taskId },
      user: { id: userId },
    } = req;

    if (isNaN(taskId)) {
      return next(createError(400, 'Invalid Task ID'));
    }

    const task = await Task.findByPk(taskId);
    if (!task) {
      return next(createError(404, 'Task not found'));
    }

    if (task.creatorId !== userId) {
      return next(createError(403, 'You can only delete your own tasks'));
    }

    const count = await Submission.count({ where: { taskId } });
    if (count > 0) {
      return next(
        createError(
          400,
          'Cannot delete task: students have already submitted work'
        )
      );
    }

    await task.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
