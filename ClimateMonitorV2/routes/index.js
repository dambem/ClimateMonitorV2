'use strict';
var express = require('express');
var fs = require('fs');
const { PassThrough, Writable } = require("stream");
var Papa = require('papaparse');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'SheffSenseV2: Sheffield Climate Monitor' });
});
router.get('/local', function (req, res) {
    res.render('index', { title: "Parsing Some Local Data" })
});

router.post('/index', function (req, res, next) {
    var userDataArray = req.body;
    console.log("Going Into Parse")
    try {
        Papa.parse("test_data.csv", {
            header: false,
            delimiter: ";",
            complete: function (result) {
                res.send(result)
            },
            error: function (error) {
                console.log(error)
            },
        })
    }
    catch (ex) {
        console.log(ex)
    }
})

module.exports = router;
