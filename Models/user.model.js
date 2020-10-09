module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        fid: {
            type: Sequelize.STRING
        },
        facebookName: {
            type: Sequelize.STRING
        },
    });

    return User;
}