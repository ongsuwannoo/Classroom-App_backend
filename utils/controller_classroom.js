const db = require('./DBConfig.js');
const config = require('./config.js');
const User = db.user;
const { classroom, user } = require('./DBConfig.js');
const Classroom = db.classroom;
const Lesson = db.lesson;
const { classroomFormat, asyncForEach, makeCode } = require('./function/classroom.function');

exports.create = (req, res) => {
    let payload = req.body

    User.findOne({
        where: { id: req.userId }
    }).then(user => {
        Classroom.create({
            name: payload.name,
            description: payload.description,
            code: makeCode(5),
            ownerId: user.id,
            day: payload.datetime.split(" ")[0],
            time: payload.datetime.split(" ")[1]
        }).then(classroom => {
            for (let i = 0; i < 6; i++) {
                Lesson.create({
                    name: 'Lesson ' + (i + 1),
                    classroomId: classroom.id
                }).catch(err => {
                    res.status(500).json({
                        "description": "Can not create lesson Page - สร้าง lesson ไม่ได้",
                        "error": err
                    });
                })
            }
            user.addClassrooms(classroom).then(() => {
                res.status(201).json({
                    "description": "Classroom Created - สร้าง Classroom แล้ว",
                    "Classroom": classroom
                });
            });
        }).catch(err => {
            res.status(500).json({
                "description": "Can not create classroom Page - สร้าง Classroom ไม่ได้",
                "error": err
            });
        })
    }).catch(err => {
        res.status(500).json({
            "description": "Can not create classroom Page - สร้าง Classroom ไม่ได้",
            "error": err
        });
    })
}

exports.getAllClassroom = (req, res) => {
    User.findOne({
        where: { id: req.userId }
    }).then((user) => {
        Classroom.findAll().then(classrooms => {

            const call = async () => {
                await asyncForEach(classrooms, async (classroom) => {
                    classroom.dataValues = await Object.assign(classroom.dataValues, await classroomFormat(user, classroom));
                })
                res.status(200).json({
                    "description": "classrooms Content Page - ดึง classrooms สำเร็จ",
                    "classrooms": classrooms
                });
            }
            call();

        }).catch(err => {
            if (isNaN(req.params.classroomId)) {
                res.status(400).json({
                    "description": "ClassroomId is not Integer - ID ของ Classroom ไม่ได้เป็นตัวเลขจำนวนเต็ม",
                    "error": err
                });
            } else {
                res.status(404).json({
                    "description": "Classroom Not Found - ไม่เจอ Classroom งับ ",
                    "error": err
                });
            }
        });
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access User Page - เข้าไม่ได้งับ",
            "error": err
        });
    })
}

exports.getClassroomById = (req, res) => {
    User.findOne({
        where: { id: req.userId, },
        include: {
            model: classroom,
            where: {
                id: req.params.classroomId
            }
        }
    }).then(async (user) => {
        let classroom = user.classrooms[0]
        classroom.dataValues = Object.assign(classroom.dataValues, await classroomFormat(user, classroom));
        res.status(200).send({
            "description": "Classroom Content Page - ดึง Classroom สำเร็จ",
            "classroom": classroom
        });
    }).catch(err => {
        if (isNaN(req.params.classroomId)) {
            res.status(400).json({
                "ClassroomIdIsNotInteger": true,
                "description": "ClassroomId is not Integer - ID ของ Classroom ไม่ได้เป็นตัวเลขจำนวนเต็ม",
                "message": "ID Classroom ที่ส่งมาไม่ใช่ตัวเลขจำนวนเต็ม",
                "error": err
            });
        } else {
            res.status(404).json({
                "NotAccessClassroom": true,
                "description": "Classroom Not Found - ไม่เจอ Classroom งับ หรือไม่ได้รับอนุญาตให้เข้า",
                "message": "กรุณากรอกรหัสเพื่อเข้าสู่ Classroom",
                "error": err
            });
        }
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access User Page - ดึงไม่ได้งับ",
            "error": err
        });
    })
}

exports.addUserClassroom = (req, res) => {
    let payload = req.body

    User.findOne({
        where: { id: req.userId, },
        include: {
            model: classroom,
            where: { code: payload.code }
        },
        rejectOnEmpty: true
    }).then((user) => {
        if (user.classrooms[0]) {
            res.status(409).send({
                "description": "Classroom Content Page - คุณเข้าสู่ Classroom นี้อยู่แล้ว",
                "message": "มี classroom นี้อยู่แล้ว",
                "ClassroomIsExist": true
            });
        }
    }).catch(err => {
        if (err.name === "SequelizeEmptyResultError") {
            User.findOne({
                where: { id: req.userId }
            }).then(user => {
                Classroom.findOne({
                    where: { code: payload.code }
                }).then(classroom => {
                    user.addClassrooms(classroom).then(() => {
                        res.status(200).json({
                            "description": "Enter classroom success! - เข้าสู่ classroom เรียบร้อยแล้ว",
                            "message": "เข้าสู่ classroom เรียบร้อยแล้ว"
                        });
                    })
                })
            })
        } else {
            res.status(500).json({
                "description": "Can not access User Page - เพิ่มไม่ได้งับ",
                "error": err
            });
        }
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access User Page - เพิ่มไม่ได้งับ",
            "error": err
        });
    })
}

exports.getAllClassroomByUser = (req, res) => {
    User.findByPk(req.userId, {
        include: {
            model: classroom
        }
    }).then((user) => {

        const call = async () => {
            await asyncForEach(user.classrooms, async (classroom) => {
                classroom.dataValues = await Object.assign(classroom.dataValues, await classroomFormat(user, classroom));
            })
            res.status(200).json({
                "description": "classrooms Content Page - ดึง classrooms สำเร็จ",
                "classrooms": user.classrooms
            });
        }
        call();

    }).catch(err => {
        res.status(500).json({
            "description": "Can not access User Page - เข้าไม่ได้งับ",
            "error": err
        });
    })
}

exports.editClassroom = (req, res) => {
    let payload = req.body;
    Classroom.findByPk(req.params.classroomId).then(classroom => {
        classroom.update({
            name: payload.name,
            description: payload.description,
            ownerId: user.id,
            day: payload.datetime.split(" ")[0],
            time: payload.datetime.split(" ")[1]
        })
        classroom.save().then(() => {
            res.status(200).json({
                "description": "classrooms update success!! - ดึง classrooms สำเร็จ",
                "classrooms": classroom
            });
        })
    })
}