const db = require('./DBConfig.js');
const config = require('./config.js');
const fs = require('fs');
const User = db.user;
const Classroom = db.classroom;

exports.create = (req, res) => {
    let playload = req.body

    User.findOne({
        where: { id: req.userId }
    }).then(user => {
        let classroom = Classroom.build({
            name: playload.name,
            description: playload.description
        })
        classroom.ownerId = user.id
        classroom.save().then(() => {
            res.status(201).json({
                "description": "Classroom Created - สร้าง Classroom แล้ว",
                "Classroom": classroom
            });
        })

    }).catch(err => {
        res.status(500).json({
            "description": "Can not access User Page - เข้า Classroom ไม่ได้",
            "error": err
        });
    })
}

exports.getClassroom = (req, res) => {
    User.findOne({
        where: { id: req.userId }
    }).then(() => {
        Classroom.findByPk(req.params.classroomId, {
            include: [{
                model: User,
                as: "owner",
                attributes: ['firstname', 'lastname', 'email', 'sid'],
            }],
            rejectOnEmpty: true
        }).then(classroom => {
            res.status(200).json({
                "description": "Classroom Content Page - ดึง Classroom สำเร็จ",
                "classroom": classroom,
                "userIsOwner": (req.userId === classroom.ownerId)
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
