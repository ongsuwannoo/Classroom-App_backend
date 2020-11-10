module.exports = (sequelize, Sequelize) => {
    const Lesson = sequelize.define('lesson', {

        title: {
            type: Sequelize.STRING,
            field: 'Title Lesson',
        },
        description: {
            type: Sequelize.TEXT,
            field: 'Lesson description',
        },
        image: {
            type: Sequelize.STRING,
            field: 'Lesson image'
        }
    });

    return Lesson;
}