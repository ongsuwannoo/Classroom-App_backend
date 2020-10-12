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
        dateTime: {
            type: DataTypes.DATE,
            field: 'Date-Time',
        }
    });

    return Classroom;
}