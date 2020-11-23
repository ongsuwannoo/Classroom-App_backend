const db = require('./DBConfig.js');
const config = require('./config.js');
const path = require("path");
const fs = require("fs");
const fetch = require('node-fetch');
const User = db.user;
const Role = db.role;
const { uploadFile } = require('./function/uploadFile.function');

// const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

async function download(url, imgName) {
    imgName = imgName.replace(/\s/g, '');
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFile('./file/img/profile/' + imgName + '.jpg', buffer, () => { })
    return '/home/django/express/Classroom-App_backend/file/img/profile/' + imgName + '.jpg';
}

exports.img = (req, res) => {
    res.sendFile('/home/django/express/Classroom-App_backend/file/img/' + req.params.img)
}

exports.imgProfile = (req, res) => {
    res.sendFile('/home/django/express/Classroom-App_backend/file/img/profile/' + req.params.img)
}

exports.pdf = (req, res) => {

    let file = fs.createReadStream('./public/RDMS.pdf');
    let stat = fs.statSync('./public/RDMS.pdf');
    res.setHeader('Content-disposition', 'inline; filename="' + 'RDMS.pdf' + '"');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    file.pipe(res);
    // console.log('\x1b[36m%s\x1b[0m', file);
}

exports.signup = (req, res) => {
    // Save User to Database
    let playload = req.body
    console.log("Processing func -> SignUp | username = " + playload.username);
    User.create({
        firstname: playload.firstname,
        lastname: playload.lastname,
        username: playload.username,
        email: playload.email,
        password: bcrypt.hashSync(playload.password, 8),
        sid: playload.sid,
    }).then(user => {
        Role.findOne({
            where: {
                name: playload.roles.toUpperCase()
            }
        }).then(roles => {
            user.setRoles(roles).then(() => {
                res.status(200).send("User registered successfully! - สมัครแล้วใช้ได้เลย!!");
            });
        }).catch(err => {
            res.status(500).send("Error -> " + err);
        });
    }).catch(err => {
        res.status(500).send("Fail! Error -> " + err);
    })
}

exports.editUser = (req, res) => {
    let fullpath;
    if (req.file){
        fullpath = uploadFile(req);
    }

    let playload = req.body

    User.findByPk(req.userId).then(user => {
        user.firstname = playload.firstname || user.firstname
        user.lastname = playload.lastname || user.lastname
        user.email = playload.email || user.email
        user.sid = playload.sid || user.sid
        user.img = fullpath || user.img

        user.save({
            attributes: ['username', 'firstname', 'lastname', 'email', 'fid', 'facebookName', 'img', 'sid'],
        }).then(user => {
            res.status(200).json({
                "description": "User Content Page - Update user เรียบร้อย",
                "user": user
            });
        });
    }).catch(err => {
        res.status(500).send("Fail! Error -> " + err);
    })
}

exports.signin = (req, res) => {
    console.log("Sign-In");

    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send('User Not Found.');
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.expiresIn // expires in 24 hours
        });

        console.log('Username : ' + user.username)
        console.log('Token : ' + token)
        res.status(200).send({ auth: true, accessToken: token });

    }).catch(err => {
        res.status(500).send('Error -> ' + err);
    });
}

exports.authFacebook = (req, res) => {
    let playload = req.body

    playload.roles = "student"

    console.log("FB Sign-in")

    createToken = (user) => {
        if (!(playload.id === user.fid)) {
            return res.status(401).send({ auth: false, accessToken: null, reason: "Facebook ID invalid!" });
        }

        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.expiresIn // expires in 24 hours
        });

        console.log('Facebook name : ' + user.facebookName);
        console.log('Token : ' + token);
        res.status(200).send({ auth: true, accessToken: token });
    }

    User.findOne({
        where: {
            email: playload.email
        }
    }).then(async (user) => {
        let urlImg = await download(playload.picture.data.url, playload.name)
        if (!user) {
            User.create({
                facebookName: playload.name,
                fid: playload.id,
                email: playload.email,
                img: urlImg
            }).then(userCreate => {
                Role.findOne({
                    where: {
                        name: playload.roles.toUpperCase()
                    }
                }).then(roles => {
                    userCreate.setRoles(roles).then(() => {
                        console.log("User Facebook registered successfully")
                        createToken(userCreate)
                    });
                }).catch(err => {
                    res.status(500).send("Error -> " + err);
                });
            }).catch(err => {
                res.status(500).send("Fail! Error -> " + err);
            })
        } else {
            user.update({
                img: urlImg
            })
            user.save()
            createToken(user)
        }
    });
}

exports.userContent = (req, res) => {
    User.findOne({
        where: { id: req.userId },
        attributes: ['username', 'firstname', 'lastname', 'email', 'fid', 'facebookName', 'img'],
        include: [{
            model: Role,
            attributes: ['id', 'name'],
            through: {
                attributes: ['userId', 'roleId'],
            }
        }]
    }).then(user => {
        console.log("User check : " + (user.username || user.facebookName), new Date().toLocaleTimeString())
        res.status(200).json({
            "description": "User Content Page - Token นี้สามารถใช้ได้",
            "user": user
        });
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access User Page - Token นี้ไม่สามารถใช้ได้",
            "error": err
        });
    })
}

exports.adminBoard = (req, res) => {
    User.findOne({
        where: { id: req.userId },
        attributes: ['firstname', 'lastname', 'email'],
        include: [{
            model: Role,
            attributes: ['id', 'name'],
            through: {
                attributes: ['userId', 'roleId'],
            }
        }]
    }).then(user => {
        res.status(200).json({
            "description": "Admin Board",
            "user": user
        });
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access Admin Board",
            "error": err
        });
    })
}

exports.managementBoard = (req, res) => {
    User.findOne({
        where: { id: req.userId },
        attributes: ['name', 'username', 'email'],
        include: [{
            model: Role,
            attributes: ['id', 'name'],
            through: {
                attributes: ['userId', 'roleId'],
            }
        }]
    }).then(user => {
        res.status(200).json({
            "description": "Management Board",
            "user": user
        });
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access Management Board",
            "error": err
        });
    })
}
