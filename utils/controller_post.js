const db = require('./DBConfig.js');
const config = require('./config.js');
const { classroom, user, lesson } = require('./DBConfig.js');
const User = db.user;
const Classroom = db.classroom;
const Lesson = db.lesson;
const Post = db.post;
const { postFromat } = require('./function/post.function');
const { uploadFile } = require('./function/uploadFile.function');

exports.create = (req, res) => {
    let payload = req.body
    Lesson.findOne({
        where: {
            id: req.params.lessonId,
            classroomId: req.params.classroomId
        }
    }).then(lesson => {

        let fullpath = uploadFile(req)

        Post.create({
            title: payload.title,
            description: payload.description,
            image: fullpath,
            lessonId: lesson.id,
            userId: req.userId
        }).then(post => {
            lesson.setPost(post).then(() => {
                res.status(201).json({
                    "description": "Post Created - สร้าง Post แล้ว",
                    "Post": post
                });
            }).catch(err => {
                res.status(500).json({
                    "description": "Can not save Lesson Page - save Lesson ไม่ได้",
                    "error": err
                });
            })
        }).catch(err => {
            res.status(500).json({
                "description": "Can not create Post Page - สร้าง Post ไม่ได้",
                "error": err
            });
        })
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access lesson Page - ไม่เจอ lesson",
            "error": err
        });
    })
}

exports.getPost = (req, res) => {
    let payload = req.body;
    Lesson.findOne({
        where: { id: req.params.lessonId },
        rejectOnEmpty: true
    }).then(lesson => {
        Post.findOne({
            where: { id: lesson.postId },
            rejectOnEmpty: true
        }).then(post => {

            const call = async () => {
                post.dataValues = await Object.assign(post.dataValues, await postFromat(req.params.classroomId));

                res.status(200).json({
                    "description": "Post Content Page - ดึง Post แล้ว",
                    "Post": post
                });
            }
            call();

        }).catch(err => {
            res.status(500).json({
                "description": "Can not access Post Content Page - ดึง Post ไม่ได้",
                "err": err
            });
        })
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access Lesson Content Page - ดึง Lesson ไม่ได้",
            "err": err
        });
    })
}