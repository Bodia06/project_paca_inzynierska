'use strict';

module.exports = (sequelize, DataTypes) => {
  const Info = sequelize.define(
    'Info',
    {
      languageName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'default-language.png',
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '1.0.0',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Info.associate = function (models) {
    Info.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
    });
  };

  return Info;
};
