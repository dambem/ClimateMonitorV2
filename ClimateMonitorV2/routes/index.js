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
// Our post route for getting daily values
router.post('/index', function (req, res, next) {
    console.log(req.body)
    var full_link = req.body['date']
    console.log(full_link)
    var options = {
        delimiter: ';', // default is ,
        endLine: '\n', // default is \n,
        columns: ['sensor_id', 'sensor_type', 'location', 'lat', 'lon', 'timestamp', 'P1', 'durP1', 'ratioP1', 'P2', 'durP2', 'ratioP2'] // by default read the first line and use values found as columns
    }
    var full_data = []
    let csvStreamPromise = new Promise((resolve, reject) => {
        var csvStream = csv.createStream(options);
        request(full_link).pipe(csvStream)
            .on('error', function (err) {
                console.log(err);
            })
            .on('data', function (data) {
                full_data.push(data)

            })
            .on('end', function () {
                resolve(full_data)
            });
    });
    csvStreamPromise.then((successMessage) => {
        res.send(successMessage)
    })
});


module.exports = router;
