'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    userID: {
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
  
    User.hasOne(models.Notification, {
      foreignKey: 'userID'
    });
  
    User.hasMany(models.Comment, {
      foreignKey: 'userID'
    });
  
    User.hasMany(models.likes, { 
      foreignKey: 'userID',
      
    });
    
  };

  return User;
};

