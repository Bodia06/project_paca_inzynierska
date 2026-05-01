'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Moderator',
          lastName: 'Test',
          displayName: 'SuperMod',
          password: '!Moder123456',
          email: 'moderator@test.com',
          role: 'moderator',
          balance: 0,
          rating: 5.0,
        },
        {
          firstName: 'Employer',
          lastName: 'Test',
          displayName: 'TechCorp',
          password: '!Employer123456',
          email: 'employer@test.com',
          role: 'employer',
          balance: 1500.0,
          rating: 4.8,
        },
        {
          firstName: 'Junior',
          lastName: 'Test',
          displayName: 'BeginnerDev',
          password: '!Beginner123456',
          email: 'beginner@test.com',
          role: 'beginner',
          balance: 200.0,
          rating: 0,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
