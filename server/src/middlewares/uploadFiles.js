const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { STATIC_PATH } = require('../constants');

const createStorage = (subFolder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const imagesPath = path.join(STATIC_PATH, 'images', subFolder);

      if (!fs.existsSync(imagesPath)) {
        fs.mkdirSync(imagesPath, { recursive: true });
      }

      cb(null, imagesPath);
    },
    filename: (req, file, cb) => {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniquePrefix}${path.extname(file.originalname)}`);
    },
  });

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

module.exports.uploadAvatar = multer({
  storage: createStorage('avatars'),
  fileFilter,
}).single('avatar');

module.exports.uploadInfoImage = multer({
  storage: createStorage('info'),
  fileFilter,
}).single('image');
