const db = require('./DBConfig.js');
const config = require('./config.js');
const { classroom, user, lesson, comment } = require('./DBConfig.js');
const User = db.user;
const Classroom = db.classroom;
const Lesson = db.lesson;
const Post = db.post;
const Comment = db.comment;

exports.create = (req, res) => {
    let payload = req.body;
    Lesson.findOne({
        where: {
            id: req.params.lessonId,
            classroomId: req.params.classroomId
        }
    }).then(lesson => {
        Post.findOne({
            where: {
                id: lesson.postId
            }
        }).then(post => {
            Comment.create({
                description: payload.description,
                userId: req.userId,
                postId: post.id
            }).then(comment => {
                post.addComment(comment).then(() => {
                    res.status(201).json({
                        "description": "Comment Created - สร้าง Comment แล้ว",
                        "Comment": comment
                    });
                })
            }).catch(err => {
                res.status(500).json({
                    "description": "Can not create Comment Page - สร้าง Comment ไม่ได้",
                    "error": err
                });
            })
        }).catch(err => {
            res.status(500).json({
                "description": "Can not found Post Page - หา Post ไม่เจอ",
                "error": err
            });
        })
    }).catch(err => {
        res.status(500).json({
            "description": "Can not found Lesson Page - หา Lesson ไม่เจอ",
            "error": err
        });
    })
}

exports.getAllCommentByPostId = (req, res) => {
    let payload = req.body;
    Post.findByPk(req.params.postId).then(post => {
        Comment.findAll({
            where: {
                postId: post.id
            }
        }).then(comments => {
            res.status(200).json({
                "description": "Post Page - หา Comments สำเร็จ",
                "Comments": comments
            });
        }).catch(err => {
            res.status(500).json({
                "description": "Can not found Comments Page - หา Comments ไม่เจอ",
                "error": err
            });
        })
    }).catch(err => {
        res.status(500).json({
            "description": "Can not found Post Page - หา Post ไม่เจอ",
            "error": err
        });
    })
}