'use strict';

const { Model, DataTypes } = require('sequelize'); // Correctly import Model and DataTypes

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {  // Extend Model directly
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'userID' });
      Notification.belongsTo(models.Post, { foreignKey: 'postID' });
      Notification.belongsTo(models.Comment, { foreignKey: 'commentID' });
    }
  }
  Notification.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' },  
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    
    postID: {
      type: DataTypes.INTEGER,
      references: { model: 'Posts', key: 'id' },  // 'Users' should match the table name exactly
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    commentID: {
      type: DataTypes.INTEGER,
      references: { model: 'Comments', key: 'id' },  // 'Users' should match the table name exactly
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    notificationType: DataTypes.STRING,  // 'reply', 'comment', 'like'
    description: DataTypes.STRING,
    isSeen: DataTypes.BOOLEAN,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });

  return Notification;
};
