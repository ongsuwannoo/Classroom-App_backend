module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define('post', {

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