'use strict';
var express = require('express');
var Papa = require('papaparse');
var fs = require('fs');
const { PassThrough, Writable } = require("stream");


const file = fs.createReadStream("test_data.csv")
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'SheffSenseV2: Sheffield Climate Monitor' });
});

router.post('/index', function (req, res,next) {
    var userDataArray = req.body;
    console.log("Going Into Parse")
    try {
        Papa.parse(file, {
            header: false,
            delimiter: "",
            complete: function (result) {
                res.send(result)
            },
            error: function (error) {
                console.log(error)
            }
        })
    }
    catch (ex) {
        console.log(ex)
    }
})

module.exports = router;
