const { Sequelize } = require('sequelize');
const env = require('./credential');

// const sequelize = new Sequelize(env.database, env.user, env.password, {
//     host: env.host,
//     dialect: 'postgres'
// });
const sequelize = new Sequelize(`postgres://${env.user}:${env.password}@${env.host}:${env.port}/${env.database}`, {logging: false})

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../Models/user.model.js')(sequelize, Sequelize);
db.role = require('../Models/role.model.js')(sequelize, Sequelize);
db.classroom = require('../Models/classroom.model.js')(sequelize, Sequelize);

db.role.belongsToMany(db.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId'});
db.user.belongsToMany(db.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});

db.classroom.belongsToMany(db.user, { through: 'user_classroom', foreignKey: 'classroomId', otherKey: 'userId'});
db.user.belongsToMany(db.classroom, { through: 'user_classroom', foreignKey: 'userId', otherKey: 'classroomId'});

module.exports = db;