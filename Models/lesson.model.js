module.exports = (sequelize, Sequelize) => {
    const Lesson = sequelize.define('lesson', {
        name: {
            type: Sequelize.STRING,
            field: 'Title Lesson',
        }
    });

    return Lesson;
}