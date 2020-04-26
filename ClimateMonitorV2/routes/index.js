'use strict';
var express = require('express');
var Papa = require('papaparse');
var fs = require('fs');
const { PassThrough, Writable } = require("stream");

var router = express.Router();
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'SheffSenseV2: Sheffield Climate Monitor' });
});

router.post('/index', function (req, res,next) {
    var userDataArray = req.body;
    console.log("Going Into Parse")
    streamHttp = "TEST"
    try {
        Papa.parse(streamHttp, {
            header: false,
            delimiter: "",
            complete: function (result) {
                res.send(result)
            }
        })
    }
    catch (ex) {
        console.log(ex)
    }
})

module.exports = router;
