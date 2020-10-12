const config = require('../utils/config.js');
const db = require('../utils/DBConfig.js');
const ROLEs = config.ROLEs;
const User = db.user;
const Role = db.role;

checkDuplicateUserNameOrEmail = (req, res, next) => {
    let playload = req.body

    if (!playload.username) {
        res.status(400).send("Fail -> Username is null");
        return;
    }

    if (!playload.email) {
        res.status(400).send("Fail -> Email is null");
        return;
    }
    
    // -> Check Username is already in use
    User.findOne({
        where: {
            username: playload.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send("Fail -> Username is already taken!");
            return;
        }

        // -> Check Email is already in use
        User.findOne({
            where: {
                email: playload.email
            }
        }).then(user => {
            if (user) {
                res.status(400).send("Fail -> Email is already in use!");
                return;
            }

            next();
        });
    });
}

checkRolesExisted = (req, res, next) => {

    if (!ROLEs.includes(req.body.roles.toUpperCase())) {
        res.status(400).send("Fail -> Does NOT exist Role = " + req.body.roles);
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
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
signUpVerify.checkRolesExisted = checkRolesExisted;
signUpVerify.checkStudentId = checkStudentId;

module.exports = signUpVerify;