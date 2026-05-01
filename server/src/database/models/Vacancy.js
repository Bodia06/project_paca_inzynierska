'use strict';

const { VACANCY_STATUS } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  const Vacancy = sequelize.define(
    'Vacancy',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01,
        },
      },
      status: {
        type: DataTypes.ENUM(...VACANCY_STATUS),
        allowNull: false,
        defaultValue: 'paid',
      },
      employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
    }
  );

  Vacancy.associate = function (models) {
    Vacancy.belongsTo(models.User, {
      foreignKey: 'employerId',
      as: 'employer',
    });
    Vacancy.hasMany(models.Solution, {
      foreignKey: 'vacancyId',
      as: 'solutions',
    });
  };

  return Vacancy;
};
