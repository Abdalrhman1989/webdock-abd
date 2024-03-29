const Sequelize = require('sequelize');
const sequelize = require('../config/database'); 

// så sync'er alle models så at tabellerne er i databasen
const syncModels = async () => {
    
  try {
    await sequelize.sync({alter: true});
    console.log('Models synced successfully.');
  } 
  catch (error) {
    console.error('Error syncing models:', error);
  }
};

module.exports =  syncModels;

