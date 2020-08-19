var express = require('express')
var router = express.Router()

// define the home page route
router.get('/example', function (req, res) {
    res.send('This is example router')
})
// define the about route
router.get('/test', function (req, res) {
    res.send('test')
})

module.exports = router