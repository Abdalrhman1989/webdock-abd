const Sequelize = require('sequelize');

const sequelize = new Sequelize('abd', 'abd', '3WmAXyexuqmk', {
  host: 'abd.vps.webdock.cloud',
  dialect: 'mysql',
});
module.exports = sequelize;