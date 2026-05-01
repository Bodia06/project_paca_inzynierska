'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Banks',
      [
        {
          cardNumber: '1111222233334444',
          name: 'John Doe',
          expiry: '12/28',
          cvc: '123',
          balance: 5000.0,
        },
        {
          cardNumber: '5555666677778888',
          name: 'Jane Smith',
          expiry: '10/27',
          cvc: '456',
          balance: 10000.0,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Banks', null, {});
  },
};
