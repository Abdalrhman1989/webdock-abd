'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: 'userID' });
      Comment.belongsTo(models.Post, { foreignKey: 'postID' });
      Comment.hasMany(models.Comment, { as: 'Replies', foreignKey: 'parentCommentId' });
      Comment.belongsTo(models.Comment, { as: 'Parent', foreignKey: 'parentCommentId' });
    }
  }
  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      references: { model: 'Users', key: 'id' },  // 'Users' should match the table name exactly
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    postID: {
      type: DataTypes.INTEGER,
      references: { model: 'Posts', key: 'id' },  // 'Users' should match the table name exactly
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    description: DataTypes.TEXT,
    parentCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id',
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};
