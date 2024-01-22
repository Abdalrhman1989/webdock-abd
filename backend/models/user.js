'use strict';

const { Model, DataTypes } = require('sequelize'); // Import Model and DataTypes

module.exports = (sequelize, DataTypes) => {
  class User extends Model {  // Extend Model directly
    static associate(models) {
      User.hasMany(models.Comment, { foreignKey: 'userID' });
      User.hasMany(models.Like, { foreignKey: 'userID' });
      User.hasMany(models.Notification, { foreignKey: 'userID' });
      User.hasMany(models.Post, { foreignKey: 'userID' });
      // Add other associations as necessary
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: "user"
    },
    avatarUrl: DataTypes.STRING,
    ssoToken: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
