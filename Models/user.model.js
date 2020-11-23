module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        firstname: {
            type: Sequelize.STRING,
            field: 'First name'
        },
        lastname: {
            type: Sequelize.STRING,
            field: 'Last name'
        },
        username: {
            type: Sequelize.STRING,
            field: 'Username'
        },
        email: {
            type: Sequelize.STRING,
            field: 'Email',
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            field: 'Phone',
        },
        img: {
            type: Sequelize.STRING,
            field: 'Image',
        },
        password: {
            type: Sequelize.STRING,
            field: 'Password'
        },
        sid: {
            type: Sequelize.STRING,
            field: 'Student ID'
        },
        fid: {
            type: Sequelize.STRING,
            field: 'Facebook ID'
        },
        facebookName: {
            type: Sequelize.STRING,
            field: 'Facebook name'
        },
    });

    return User;
}