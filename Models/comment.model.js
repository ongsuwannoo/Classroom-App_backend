module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comment', {
        description: {
            type: Sequelize.STRING,
            field: 'Description Comment',
        }
    });

    return Comment;
}