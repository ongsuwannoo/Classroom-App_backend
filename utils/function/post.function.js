const db = require('../DBConfig.js');
const User = db.user;
const Classroom = db.classroom;
const Lesson = db.lesson;

exports.postFromat = async (classroomId) => {
    let classroom = await Classroom.findByPk(classroomId).then(classroom => { return classroom })
    let user = await User.findByPk(classroom.ownerId, {
        attributes: ['username', 'firstname', 'lastname', 'facebookName', 'img']
    }).then(user => {
        if (user.firstname && user.lastname)
            return ({ nameOwner: user.firstname + " " + user.lastname, userOwner: user })
        else if (user.facebookName)
            return ({ nameOwner: user.facebookName, userOwner: user })
    })
    return {
        userOwnerPost: user
    }
}