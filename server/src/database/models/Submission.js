'use strict';

module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define(
    'Submission',
    {
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      githubUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isUrl: true },
      },
      grade: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 5 },
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['taskId', 'userId'],
        },
      ],
    }
  );

  Submission.associate = function (models) {
    Submission.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'student',
    });
    Submission.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task',
    });
  };

  return Submission;
};
