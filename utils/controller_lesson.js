const db = require('./DBConfig.js');
const config = require('./config.js');
const path = require("path");
const fs = require("fs");
const { classroom, user, lesson } = require('./DBConfig.js');
const User = db.user;
const Classroom = db.classroom;
const Lesson = db.lesson;

exports.create = (req, res) => {
    let playload = req.body
    Classroom.findByPk(req.params.classroomId)
        .then(classroom => {
            Lesson.create({
                name: playload.name,
                classroomId: classroom.id
            }).then((classroom) => {
                res.status(201).json({
                    "description": "lesson Content Page - สร้าง lesson สำเร็จ",
                    "lessons": classroom
                })
            }).catch(err => {
                res.status(500).json({
                    "description": "Can not create lesson Page - สร้าง lesson ไม่ได้",
                    "error": err
                });
            })
        }).catch(err => {
            res.status(500).json({
                "description": "Can not found classroom Page - หา classroom ไม่เจอ",
                "error": err
            });
        })
}

exports.getAllLessonByClassroom = (req, res) => {
    Classroom.findByPk(req.params.classroomId)
        .then(classroom => {
            Lesson.findAll({
                where: { classroomId: classroom.id },
            }).then((lessons) => {
                if (lessons.length == 0) {
                    res.status(404).json({
                        "description": "lessons Content Page - ไม่เจอ lessons ของ classroom",
                        "lessons": lessons
                    });
                } else {
                    res.status(200).json({
                        "description": "lessons Content Page - ดึง lessons สำเร็จ",
                        "lessons": lessons
                    });
                }
            }).catch(err => {
                res.status(500).json({
                    "description": "Can not access User Page - เข้าไม่ได้งับ",
                    "error": err
                });
            })
        }).catch(err => {
            res.status(404).json({
                "description": "Can not found classroom Page - ไม่เจอ classroom",
                "error": err
            });
        })
}

exports.editLesson = (req, res) => {
    let playload = req.body
    Lesson.findOne({
        where: {
            id: req.params.lessonId,
            classroomId: req.params.classroomId
        }
    }).then(lesson => {
        lesson.name = playload.name;
        lesson.save().then((lesson) => {
            res.status(200).json({
                "description": "lessons Content Page - แก้ lessons สำเร็จ",
                "lesson": lesson
            })
        }).catch(err => {
            res.status(500).json({
                "description": "Can not edit lesson Page - แก้ไมได้",
                "error": err
            });
        })

    }).catch(err => {
        res.status(500).json({
            "description": "Can not found classroom Page - หา classroom ไม่เจอ",
            "error": err
        });
    })
}

exports.deleteLesson = (req, res) => {
    let playload = req.body
    Lesson.findOne({
        where: {
            id: req.params.lessonId,
            classroomId: req.params.classroomId
        }
    }).then(lesson => {
        lesson.destroy().then(() => {
            res.status(200).json({
                "description": "lessons Content Page - ลบ lessons สำเร็จ"
            })
        }).catch(err => {
            res.status(500).json({
                "description": "Can not edit lesson Page - ลบไมได้",
                "error": err
            });
        })
    }).catch(err => {
        res.status(500).json({
            "description": "Can not found classroom Page - หา classroom ไม่เจอ",
            "error": err
        });
    })
}