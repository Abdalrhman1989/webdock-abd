'use strict';

const { Model, DataTypes } = require('sequelize'); // Import Sequelize and DataTypes

module.exports = (sequelize, DataTypes) => {
  class Like extends Model { // Extend from Model directly
    static associate(models) {
      // Define associations here
      Like.belongsTo(models.User, { foreignKey: 'userID' });
      Like.belongsTo(models.Post, { foreignKey: 'postID' });
      Like.belongsTo(models.Comment, { foreignKey: 'commentID' });
    }
  }
  Like.init({
    // This is the unique ID for each like
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // This is the ID of the user who made the like
    userID: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' },  // 'Users' should match the table name exactly
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    // This is the ID of the post that was liked, if applicable
    postID: {
        type: DataTypes.INTEGER,
        references: { model: 'Posts', key: 'id' },  // 'Users' should match the table name exactly
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
    // This is the ID of the comment that was liked, if applicable
    commentID: {
      type: DataTypes.INTEGER,
      references: { model: 'Comments', key: 'id' },  // 'Users' should match the table name exactly
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    // Timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Like',
  });

  return Like;
};
