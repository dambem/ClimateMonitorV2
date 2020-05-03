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
        endLine: '\n', // default is \n,
        columns: ['sensor_id', 'sensor_type', 'location', 'lat', 'lon', 'timestamp', 'P1', 'durP1', 'ratioP1', 'P2', 'durP2', 'ratioP2'] // by default read the first line and use values found as columns
    }
    console.log("Going Into Parse")
    var full_data = []
    let csvStreamPromise = new Promise((resolve, reject) => {
        var header = true;
        var csvStream = csv.createStream(options);
        request('http://archive.sensor.community/2020-04-24/2020-04-24_sds011_sensor_20926.csv').pipe(csvStream)
            .on('error', function (err) {
                console.log(err);
            })
            .on('header', function (columns) {
                console.log(columns);
            })
            .on('data', function (data) {
                console.log(data)
                full_data.push(data)

            })
            .on('end', function () {
                resolve(full_data)
            });
    });
    csvStreamPromise.then((successMessage) => {
        console.log("Yay, we've succeded" + successMessage)
        res.send(successMessage)
    })
});

module.exports = router;
