'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Comments', "description", {
      type : Sequelize.TEXT
});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Comments', "description", {
      type : Sequelize.STRING
});
  }
};

