const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function (app) {

    const controller = require('../utils/controller.js');
    const controller_classroom = require('../utils/controller_classroom.js');

    //user

    app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserName, verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted], controller.signup);

    app.post('/api/auth/signin', controller.signin);

    app.post('/api/auth/facebook', [verifySignUp.checkDuplicateEmail], controller.authFacebook);

    app.get('/api/test/user', [authJwt.verifyToken], controller.userContent);

    app.post('/api/test/sid', verifySignUp.checkStudentId);

    app.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

    //classroom

    app.post('/api/classroom/create', [authJwt.verifyToken], controller_classroom.create);

    app.get('/api/classroom/get/all', [authJwt.verifyToken], controller_classroom.getAllClassroom);

    app.get('/api/classroom/get/:classroomId', [authJwt.verifyToken], controller_classroom.getClassroomById);

    app.post('/api/classroom/enter', [authJwt.verifyToken], controller_classroom.addUserClassroom);

    app.get('/api/classroom/get/all/classroombyuser', [authJwt.verifyToken], controller_classroom.getAllClassroomByUser);

    //other

    app.get('/api/get/pdf', controller.pdf);

}