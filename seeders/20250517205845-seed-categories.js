"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    console.log("Seeding categories with data:", [
      {
        name: "Local",
        description: "Local causes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Emergency",
        description: "Emergency causes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Recurring",
        description: "Recurring causes",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert("Categories", [
      {
        name: "Local",
        description: "Local causes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Emergency",
        description: "Emergency causes",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Recurring",
        description: "Recurring causes",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
