'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Define associations here
    await queryInterface.addColumn('Likes', 'postID', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Posts', 
        key: 'postID', 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('Likes', 'userID', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users', 
        key: 'userID', 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the associations if needed in the down function
    await queryInterface.removeColumn('Likes', 'postID');
    await queryInterface.removeColumn('Likes', 'userID');
  },
};
