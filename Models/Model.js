const { DataTypes } = require('sequelize');
const db = require('../utils/DBConfig')
const sequelize = db.sequelize

Model = {};
Model.User = require('./user.model')(sequelize, DataTypes);
Model.Classroom = require('./classroom.model')(sequelize, DataTypes);

Model.User.hasMany(Model.Classroom, { as: "classrooms" });
Model.Classroom.belongsTo(Model.User, {
    as: "owner",
});

module.exports = Model;