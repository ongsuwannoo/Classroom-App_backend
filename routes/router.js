const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

const multer = require('multer');
const upload_img = multer({ dest: './file/img/' });

module.exports = function (app) {

    const controller = require('../utils/controller.js');
    const controller_classroom = require('../utils/controller_classroom.js');
    const controller_lesson = require('../utils/controller_lesson.js');
    const controller_post = require('../utils/controller_post.js');
    const controller_comment = require('../utils/controller_comment.js');

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

    // lessons

    app.post('/api/classroom/:classroomId/lesson/create', [authJwt.verifyToken], controller_lesson.create);

    app.get('/api/classroom/:classroomId/lesson', [authJwt.verifyToken], controller_lesson.getAllLessonByClassroom);

    app.patch('/api/classroom/:classroomId/lesson/:lessonId', [authJwt.verifyToken], controller_lesson.editLesson);

    app.delete('/api/classroom/:classroomId/lesson/:lessonId', [authJwt.verifyToken], controller_lesson.deleteLesson);

    //post

    app.post('/api/classroom/:classroomId/lesson/:lessonId/post', [authJwt.verifyToken], upload_img.single('img'), controller_post.create);

    app.get('/api/classroom/:classroomId/lesson/:lessonId/post', [authJwt.verifyToken], controller_post.getPost);

    //comment

    app.post('/api/classroom/:classroomId/lesson/:lessonId/post/:postId/comment', [authJwt.verifyToken], controller_comment.create);

    app.get('/api/classroom/:classroomId/lesson/:lessonId/post/:postId/comment', [authJwt.verifyToken], controller_comment.getAllCommentByPostId);

    //other

    app.get('/api/get/pdf', controller.pdf);

    app.get('/api/get/img', controller.img);

}