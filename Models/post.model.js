module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define('post', {

        title: {
            type: Sequelize.STRING,
            field: 'Post title',
        },
        description: {
            type: Sequelize.TEXT,
            field: 'Post description',
        },
        image: {
            type: Sequelize.STRING,
            field: 'Post image'
        }
    });

    return Post;
}