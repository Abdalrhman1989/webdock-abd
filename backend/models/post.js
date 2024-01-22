'use strict';

const { Model, DataTypes } = require('sequelize'); // Import Model and DataTypes

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {  // Extend Model directly
    static associate(models) {
      Post.hasMany(models.Comment, { foreignKey: 'postID' });
      Post.hasMany(models.Like, { foreignKey: 'postID' });
      Post.belongsTo(models.User, { foreignKey: 'userID' });
      // Include any additional associations here
    }
  }
  Post.init({
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
    category: DataTypes.STRING,
    title: DataTypes.STRING,
    status: DataTypes.STRING,
    description: DataTypes.TEXT,
    tag: DataTypes.STRING,
    image: DataTypes.BLOB,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Post',
  });

  return Post;
};
