const db = require('./DBConfig.js');
const config = require('./config.js');
const path = require("path");
const fs = require("fs");
const { classroom, user, lesson } = require('./DBConfig.js');
const User = db.user;
const Classroom = db.classroom;
const Lesson = db.lesson;
const Post = db.post;

const handleError = (err, res) => {
    res.status(500).send(err)
    return;
};

exports.create = (req, res) => {
    console.log("CREATE POST")
    let payload = req.body
    Lesson.findOne({
        where: {
            id: req.params.lessonId,
            classroomId: req.params.classroomId
        }
    }).then(lesson => {

        // upload file
        let tempPath = req.file.path;
        let targetPath = path.join(tempPath);

        if (req.file.mimetype === "image/png") {
            targetPath = targetPath + '.png';
            fs.rename(tempPath, (targetPath + '.png'), err => {
                if (err) return handleError(err, res);
                // res.status(200).contentType("text/plain").end("File uploaded!");
            });
        } else if (req.file.mimetype === "image/jpeg") {
            targetPath = targetPath + '.jpg';
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);
                // res.status(200).contentType("text/plain").end("File uploaded!");
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);

                res.status(403).contentType("text/plain").end("Only .png or .jpeg files are allowed!");
                return
            });
        }

        let fullpath = path.join(__dirname, '../', targetPath);
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
    Lesson.findByPk(req.params.lessonId).then(lesson => {
        Post.findByPk(lesson.postId).then(post => {
            res.status(200).json({
                "description": "Post Content Page - ดึง Post แล้ว",
                "Post": post
            });
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