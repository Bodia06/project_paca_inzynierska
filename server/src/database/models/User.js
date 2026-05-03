'use strict';
const { USER_ROLES } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'anon.png',
      },
      role: {
        type: DataTypes.ENUM(...USER_ROLES),
        allowNull: false,
      },
      cardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'Banks',
          key: 'cardNumber',
        },
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Info, {
      foreignKey: 'userId',
      as: 'updates',
    });
    User.hasMany(models.Task, {
      foreignKey: 'creatorId',
      as: 'createdTasks',
    });
    User.hasMany(models.Submission, {
      foreignKey: 'userId',
      as: 'mySubmissions',
    });
    User.belongsTo(models.Bank, {
      foreignKey: 'cardNumber',
      targetKey: 'cardNumber',
      as: 'bankAccount',
    });
    User.hasMany(models.Vacancy, {
      foreignKey: 'employerId',
      as: 'vacancies',
    });
    User.hasMany(models.Solution, {
      foreignKey: 'beginnerId',
      as: 'solutions',
    });
  };

  return User;
};
