module.exports = (sequelize, Sequelize) => {
    const Classroom = sequelize.define('classroom', {

        name: {
            type: Sequelize.STRING,
            field: 'Class name',
        },
        description: {
            type: Sequelize.TEXT,
            field: 'Class description',
        },
        code: {
            type: Sequelize.STRING,
            field: 'Class code',
            allowNull: false,
            unique: true
        },
        ownerId: {
            type: Sequelize.INTEGER,
            field: 'Class Owner ID',
        },
        day:{
            type: Sequelize.STRING,
            field: 'Class date'
        },
        time:{
            type: Sequelize.TIME,
            field: 'Class time'
        }
    });

    return Classroom;
}