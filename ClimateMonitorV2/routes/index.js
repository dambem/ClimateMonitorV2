'use strict';
var express = require('express');
const { StringStream } = require("scramjet");

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'SheffSenseV2: Sheffield Climate Monitor' });
});

router.post('/', function (req, res,next) {
    var userData = req.body;

    return userData
})

module.exports = router;
