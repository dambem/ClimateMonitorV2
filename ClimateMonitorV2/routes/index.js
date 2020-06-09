'use strict';
var express = require('express');
var fs = require('fs');
const { PassThrough, Writable } = require("stream");
var Papa = require('papaparse');
var router = express.Router();
var csv = require('csv-stream');
var request = require("request")
var requestify = require('requestify')
/* Pull Request Test */
/* GET home page. */
router.get('/test', function (req, res) {
    res.render("newtest", { title: "SheffSenseV2: Sheffield Climate Monitor" });
});
router.get('/', function (req, res) {
    res.render('index', { title: 'SheffSenseV2: Sheffield Climate Monitor' });
});
router.get('/local', function (req, res) {
    res.render('index', { title: "Parsing Some Local Data" })
});
router.post('/link', function (req, res) {
    console.log(req.body)
    requestify.get(req.body['url']).then(function (response) {
        console.log(response.code)
        res.send(response.code)
    })
})

function build_link_from_date(date, sensor_id) {
    year = date.getFullYear();
    month = date.getMonth();
    if (month < 10) {
        month = "0" + month
    }
    day = date.getDay();
    if (day < 10) {
        day = "0" + day
    }
    link = "http://archive.sensor.community/" + year + "-" + month + "-" + day + "/" + year + "-" + month + "-" + day + "_" + "sds011_sensor_" + sensor_id + ".csv"
    return link
}
// Our post route for getting daily values
router.post('/index', function (req, res, next) {
    console.log(req.body)
    var full_link = req.body['date']
    var id = req.body['id']
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

router.post('/multipledates', function (req, res, next) {
    
}

module.exports = router;
