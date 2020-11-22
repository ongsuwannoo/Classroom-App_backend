const db = require('../DBConfig.js');
const User = db.user;

exports.classroomFormat = async (user, classroom) => {
    let userIsOwner = user.id == classroom.ownerId;
    let userOwner = await User.findByPk(classroom.ownerId, {
        attributes: ['username', 'firstname', 'lastname', 'facebookName', 'img']
    }).then(user => {
        if (user.firstname && user.lastname)
            return ({ nameOwner: user.firstname + " " + user.lastname, userOwner: user })
        else if (user.facebookName)
            return ({ nameOwner: user.facebookName, userOwner: user })
    })
    return {
        userIsOwner: userIsOwner,
        userOwner: userOwner.userOwner,
        nameOwner: userOwner.nameOwner
    }
}

exports.asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

exports.makeCode = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}