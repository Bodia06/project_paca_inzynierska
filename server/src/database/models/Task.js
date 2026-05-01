'use strict';

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      modul: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Task.associate = function (models) {
    Task.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'moderator',
    });
    Task.hasMany(models.Submission, {
      foreignKey: 'taskId',
      as: 'submissions',
    });
  };

  return Task;
};
