const jwt = require('jsonwebtoken');
const config = require('../utils/config.js');
const db = require('../utils/DBConfig.js');
const Role = db.role;
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({
            auth: false,
            message: 'No token provided. - ไม่มี token ส่งมางาา'
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: 'Fail to Authentication. - Token ผิด Error -> ' + err
            });
        }
        req.userId = decoded.id;
        next();
    });
}

isAdmin = (req, res, next) => {
    let token = req.headers['x-access-token'];

    User.findByPk(req.userId)
        .then(user => {
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name.toUpperCase() === "ADMIN") {
                        next();
                        return;
                    }
                }
                return res.status(403).send("Require Admin Role!");
            })
        })
}

isPmOrAdmin = (req, res, next) => {
    let token = req.headers['x-access-token'];

    User.findByPk(req.userId)
        .then(user => {
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name.toUpperCase() === "PM") {
                        next();
                        return;
                    }

                    if (roles[i].name.toUpperCase() === "ADMIN") {
                        next();
                        return;
                    }
                }

                res.status(403).send("Require PM or Admin Roles!");
            })
        })
}

const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;
authJwt.isPmOrAdmin = isPmOrAdmin;

module.exports = authJwt;