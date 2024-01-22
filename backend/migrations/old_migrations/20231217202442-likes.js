'use strict';

const { INTEGER } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.createTable('likes', { postLikeAmount: Sequelize.INTEGER, userID: Sequelize.INTEGER, postID: Sequelize.INTEGER });

  },

  async down (queryInterface, Sequelize) {
    
    
    await queryInterface.removeColumn('Posts', 'likedPost');
    
  }
};
