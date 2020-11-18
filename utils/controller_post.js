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
    let playload = req.body
    Classroom.findByPk(req.params.classroomId)
        .then(classroom => {

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
            Lesson.create({
                title: playload.title,
                description: playload.description,
                image: fullpath,
                classroomId: classroom.id
            }).then(lesson => {
                res.status(201).json({
                    "description": "Lesson Created - สร้าง Lesson แล้ว",
                    "Lesson": lesson
                });
            }).catch(err => {
                res.status(500).json({
                    "description": "Can not create lesson Page - สร้าง lesson ไม่ได้",
                    "error": err
                });
            })
        }).catch(err => {
            res.status(500).json({
                "description": "Can not access classroom Page - ไม่เจอ classroom",
                "error": err
            });
        })
}