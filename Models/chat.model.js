module.exports = (sequelize, Sequelize) => {
    const Chat = sequelize.define('chat', {
        text: {
            type: Sequelize.STRING,
            field: 'Text',
        },
        ownerId:{
            type: Sequelize.INTEGER,
            field: 'ownerId',
        },
        classroomId:{
            type: Sequelize.INTEGER,
            field: 'classroomId',
        },
        nameOfuser: {
            type: Sequelize.STRING,
            field: 'nameOfuser',
        }
    });

    return Chat;
}