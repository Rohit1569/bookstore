'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn('users', 'isAdmin', 'is_admin')
    await queryInterface.renameColumn('users', 'createdAt', 'created_at')
    await queryInterface.renameColumn('users', 'updatedAt', 'updated_at')
    await queryInterface.renameColumn('users', 'deletedAt', 'deleted_at')
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};