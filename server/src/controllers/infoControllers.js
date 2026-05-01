const fs = require('fs');
const path = require('path');
const createError = require('http-errors');
const { Op } = require('sequelize');
const { Info, User } = require('../database/models');
const { STATIC_PATH } = require('../constants');

module.exports.createInfo = async (req, res, next) => {
  try {
    const { body, file, user } = req;

    const newUpdate = await Info.create({
      ...body,
      image: file ? file.filename : 'default-language.png',
      userId: user.id,
    });

    const result = await Info.findByPk(newUpdate.id, {
      include: [
        { model: User, as: 'author', attributes: ['displayName', 'avatar'] },
      ],
    });

    res.status(201).send({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports.getInfo = async (req, res, next) => {
  try {
    const { id, languageName, version } = req.query;
    const { limit, offset } = req.pagination;

    const where = {};
    if (id) where.id = id;
    if (languageName) where.languageName = { [Op.iLike]: languageName };
    if (version) where.version = version;

    const { count, rows: updates } = await Info.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['displayName', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
      distinct: true,
    });

    res.status(200).send({
      data: updates,
      meta: { count, limit, offset },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getInfoById = async (req, res, next) => {
  try {
    const { infoId } = req.params;
    const info = await Info.findByPk(infoId, {
      include: [
        { model: User, as: 'author', attributes: ['displayName', 'avatar'] },
      ],
    });

    if (!info) {
      return next(createError(404, 'Update not found'));
    }

    res.status(200).send({ data: info });
  } catch (err) {
    next(err);
  }
};

module.exports.updateInfo = async (req, res, next) => {
  try {
    const {
      params: { infoId },
      body,
      file,
    } = req;

    const info = await Info.findByPk(infoId);
    if (!info) {
      return next(createError(404, 'Info not found'));
    }

    if (file && info.image && info.image !== 'default-info.png') {
      const oldImagePath = path.join(STATIC_PATH, 'images', 'info', info.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const updatedData = {
      ...body,
      image: file ? file.filename : info.image,
    };

    await info.update(updatedData);

    const updatedInfo = await Info.findByPk(infoId, {
      include: [
        { model: User, as: 'author', attributes: ['displayName', 'avatar'] },
      ],
    });

    res.status(200).send({ data: updatedInfo });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteInfo = async (req, res, next) => {
  try {
    const { infoId } = req.params;

    const info = await Info.findByPk(infoId);
    if (!info) {
      return next(createError(404, 'Info not found'));
    }

    if (info.image && info.image !== 'default-info.png') {
      const imagePath = path.join(STATIC_PATH, 'images', 'info', info.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await info.destroy();
    res.status(200).send({ data: infoId });
  } catch (err) {
    next(err);
  }
};
