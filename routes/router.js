const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const controller = require('../utils/controller.js');
    const controller_classroom = require('../utils/controller_classroom.js');

    app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], controller.signup);

    app.post('/api/auth/signin', controller.signin);

    app.post('/api/test/sid', verifySignUp.checkStudentId);

    app.post('/api/classroom/create', [authJwt.verifyToken], controller_classroom.create);

    app.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

    app.get('/api/get/pdf', controller.pdf);

    app.get('/api/classroom/get/:classroomId', [authJwt.verifyToken], controller_classroom.getClassroom);

}