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
router.get('/about', function (req, res) {
    res.render('about', { title: 'About SheffSenseV2' });
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
const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}
function build_link_from_date(date, sensor_id) {
    var year
    var month
    var day
    var link
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
    var full_link = req.body['date']
    var id = req.body['id']
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
function getUrl(url, chosen_date) {
    return new Promise((resolve) => {
        requestify.get(url)
            .then(function (response) {
                resolve([chosen_date, true])
            })
            .fail(function (response) {
                resolve([chosen_date, false])
            })
    })

}
router.post('/checkdates', function (req, res, next) {
    var i
    var list_of_dates = []
    var id = req.body['id']
    var promises = []
    for (i = 1; i < 100; i++) {
        var chosen_date = new Date();
        chosen_date.setDate(chosen_date.getDate() - i)
        var url = build_link_from_date(chosen_date, id)
        console.log("Initial Push")
        promises.push(getUrl(url, chosen_date))
    }
    console.log("almost got there")
    Promise.all(promises)
        .then((results) => {
            console.log(results)
            console.log("finished!")
            res.send(results)
        })
        .catch((e) => {
            console.log(e)
        });
})

module.exports = router;
