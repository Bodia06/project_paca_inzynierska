const createError = require('http-errors');
const { Op } = require('sequelize');
const { Info, User } = require('../database/models');
const { uploadFile, deleteFile } = require('../services/s3Service');

module.exports.createInfo = async (req, res, next) => {
  try {
    const { body, file, user } = req;

    let imageName = 'default-language.png';
    
    if (file) {
      imageName = await uploadFile(file, 'info');
    }

    const newUpdate = await Info.create({
      ...body,
      image: imageName,
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

    let imageName = info.image;

    if (file) {
      if (info.image && info.image !== 'default-language.png') {
        await deleteFile(info.image, 'info');
      }
      imageName = await uploadFile(file, 'info');
    }

    const updatedData = {
      ...body,
      image: imageName,
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

    if (info.image && info.image !== 'default-language.png') {
      await deleteFile(info.image, 'info');
    }

    await info.destroy();
    res.status(200).send({ data: infoId });
  } catch (err) {
    next(err);
  }
};