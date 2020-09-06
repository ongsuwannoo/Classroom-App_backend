const { Sequelize } = require('sequelize');
const env = require('./credential');

// const sequelize = new Sequelize(env.database, env.user, env.password, {
//     host: env.host,
//     dialect: 'postgres'
// });
const sequelize = new Sequelize(`postgres://${env.user}:${env.password}@${env.host}:${env.port}/${env.database}`)

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../Models/user.model.js')(sequelize, Sequelize);
db.role = require('../Models/role.model.js')(sequelize, Sequelize);

db.role.belongsToMany(db.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId'});
db.user.belongsToMany(db.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});
module.exports = db;