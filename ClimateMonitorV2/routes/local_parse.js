'use strict';
var express = require('express');
var Papa = require('papaparse');
var fs = require('fs');
const { PassThrough, Writable } = require("stream");

var router = express.Router();
/* GET home page. */
router.get('/local', function (req, res) {
    res.render('index', { title: "Parsing Some Local Data" })
});
router.post('/local', function (req, res, next) {
    var filename = __dirname
    console.log(filename)
    var readStream = fs.createReadStream(filename)
    readStream.on('open', function () {
        readStream.pipe(res);
    })
    readStream.on('error', function (err) {
        res.end(err)
        console.log(error)
    })
})
module.exports = router;
