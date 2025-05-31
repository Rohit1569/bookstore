'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('users', [{
      id: "5611e94a-7056-4dbd-913c-3cc28fe809d2",
      name: "Admin",
      age: 18,
      username: "admin",
      gender: "Male",
      is_admin: true,
      password: "$2a$12$imelz144AKM9inYS.CAoUew2LRMGqjS9k.MyCnTsbYZugfIH9MSSO",
      created_at: new Date(),
      updated_at: new Date(),
  }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
