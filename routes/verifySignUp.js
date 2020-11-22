const config = require('../utils/config.js');
const db = require('../utils/DBConfig.js');
const ROLEs = config.ROLEs;
const User = db.user;
const Role = db.role;

checkDuplicateUserName = (req, res, next) => {
    let playload = req.body
    
    if (!playload.username) {
        res.status(400).send({
            "description": "Fail -> Username is null - username ว่างอ่าา",
            "NullUserName": true
        });
        return;
    }

    // -> Check Username is already in use
    User.findOne({
        where: {
            username: playload.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                "description": "Fail -> Username is already taken! - มี username นี้แย้วว",
                "DuplicateUserName": true
            });
            return;
        }
        next();
    });

}

checkDuplicateEmail = (req, res, next) => {
    let playload = req.body

    if (!playload.email) {
        res.status(409).send({
            "description": "Fail -> Email is null - email มันว่างไม่ได้นะคัฟ",
            "NullEmail": true
        });
        return;
    }

    // -> Check Email is already in use
    User.findOne({
        where: {
            email: playload.email
        }
    }).then(user => {

        if (user && (!user.id)) {
            res.status(400).send({
                "description": "Fail -> Email is already in use! - มีคนแย่ง email ไปแล้วว",
                "checkDuplicateEmail": true
            });
            return;
        }
        next();
    });
}

checkRolesExisted = (req, res, next) => {

    if (!ROLEs.includes(req.body.roles.toUpperCase())) {
        res.status(400).send({
            "description": "Fail -> Does NOT exist Role - role ผิดงับบ = " + req.body.roles,
            "RolesNotExisted": true
        });
        return;
    }
    next();
}

checkStudentId = (req, res, next) => {
    let playload = req.body
    if (isNaN(playload.sid)) {
        res.status(400).send("Fail -> Student ID is invalid = " + playload.sid);
        return;
    }

    if (playload.sid.length != 8) {
        res.status(400).send("Fail -> Student ID is invalid = " + playload.sid);
        return;
    }

    res.status(200).send("Test success sid = " + playload.sid);
    // next();
    return;
}

const signUpVerify = {};
signUpVerify.checkDuplicateUserName = checkDuplicateUserName;
signUpVerify.checkDuplicateEmail = checkDuplicateEmail;
signUpVerify.checkRolesExisted = checkRolesExisted;
signUpVerify.checkStudentId = checkStudentId;

module.exports = signUpVerify;