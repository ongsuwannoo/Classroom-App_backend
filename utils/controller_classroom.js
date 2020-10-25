const db = require('./DBConfig.js');
const config = require('./config.js');
const { classroom } = require('./DBConfig.js');
const User = db.user;
const Classroom = db.classroom;

function makeCode(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.create = (req, res) => {
    let playload = req.body

    User.findOne({
        where: { id: req.userId }
    }).then(user => {
        Classroom.create({
            name: playload.name,
            description: playload.description,
            code: makeCode(5),
            ownerId: user.id
        }).then(classroom => {
            user.setClassrooms(classroom).then(() => {
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
    }).then(() => {
        Classroom.findAll().then(classrooms => {
            classrooms.forEach(classroom => {
                classroom.dataValues.userIsOwner = (req.userId === classroom.userId)
            });
            res.status(200).json({
                "description": "classrooms Content Page - ดึง classrooms สำเร็จ",
                "classrooms": classrooms
            });
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

exports.getClassroom = (req, res) => {
    User.findOne({
        where: { id: req.userId }
    }).then(() => {
        Classroom.findByPk(req.params.classroomId, {
            rejectOnEmpty: true
        }).then(classroom => {
            classroom.dataValues.userIsOwner = (req.userId === classroom.userId)
            res.status(200).send({
                "description": "Classroom Content Page - ดึง Classroom สำเร็จ",
                "classroom": classroom
            });
        }).catch(err => {
            if (isNaN(req.params.classroomId)) {
                res.status(400).json({
                    "description": "ClassroomId is not Integer - ID ของ Classroom ไม่ได้เป็นตัวเลขจำนวนเต็ม",
                    "error": err
                });
            } else {
                res.status(404).json({
                    "description": "Classroom Not Found - ไม่เจอ Classroom งับ",
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

exports.userClassroom = (req, res) => {
    let playload = req.body
    User.findOne({
        where: { id: req.userId }
    }).then(user => {
        Classroom.findOne({
            where: { code: playload.code }
        }).then(classroom => {
            user.setClassrooms(classroom).then(() => {
                res.status(200).json({
                    "description": "Enter classroom success! - เข้าสู่ classroom เรียบร้อยแล้ว",
                });
            })
        })
    })
}
