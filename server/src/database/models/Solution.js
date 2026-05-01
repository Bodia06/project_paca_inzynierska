'use strict';

const { SOLUTION_STATUS } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  const Solution = sequelize.define(
    'Solution',
    {
      githubLink: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      status: {
        type: DataTypes.ENUM(...SOLUTION_STATUS),
        allowNull: false,
        defaultValue: 'pending',
      },
      vacancyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Vacancies',
          key: 'id',
        },
      },
      beginnerId: {
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

  Solution.associate = function (models) {
    Solution.belongsTo(models.Vacancy, {
      foreignKey: 'vacancyId',
      as: 'vacancy',
    });
    Solution.belongsTo(models.User, {
      foreignKey: 'beginnerId',
      as: 'beginner',
    });
  };

  return Solution;
};
