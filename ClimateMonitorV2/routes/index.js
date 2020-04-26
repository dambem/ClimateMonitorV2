'use strict';
var express = require('express');
var fs = require('fs');
const { PassThrough, Writable } = require("stream");
var Papa = require('papaparse');
var router = express.Router();
var csv = require('csv-stream');
var request = require("request")
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'SheffSenseV2: Sheffield Climate Monitor' });
});
router.get('/local', function (req, res) {
    res.render('index', { title: "Parsing Some Local Data" })
});

router.post('/index', function (req, res, next) {
    var userDataArray = req.body;
    var options = {
        delimiter: ';', // default is ,
        endLine: ';;', // default is \n,
        columns: ['columnName1', 'columnName2'] // by default read the first line and use values found as columns
    }
    console.log("Going Into Parse")
    var full_data = []
    let csvStreamPromise = new Promise((resolve, reject) => {
        var csvStream = csv.createStream(options);
        request('http://archive.sensor.community/2020-04-24/2020-04-24_sds011_sensor_20926.csv').pipe(csvStream)
            .on('error', function (err) {
                console.log(err);
            })
            .on('header', function (columns) {
                console.log(columns);
            })
            .on('data', function (data) {
                console.log(data);
                console.log(full_data)
                resolve(full_data)

            })
            .on('column', function (key, value) {
                console.log('#' + key + '=' + value);
                full_data.push(value)

            })

    });
    csvStreamPromise.then((successMessage) => {
        console.log("Yay, we've succeded" + successMessage)
    })
});

module.exports = router;
