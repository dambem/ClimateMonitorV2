'use strict';
var express = require('express');
var fs = require('fs');
const { PassThrough, Writable } = require("stream");
var Papa = require('papaparse');
var router = express.Router();
var csv = require('csv-stream');
var request = require("request")
var requestify = require('requestify')
var JSONStream = require('JSONStream')
var parseUrl = require('url').parse
router.get('/test', function (req, res) {
    res.render("newtest", { title: "SheffSenseV2: Sheffield Climate Monitor" });
});
router.get('/', function (req, res) {
    res.render('index', { title: 'SheffSenseV2: Sheffield Climate Monitor' });
});
router.get('/about', function (req, res) {
    res.render('about', { title: 'About SheffSenseV2' });
});
router.get('/detailedstats', function (req, res) {
    res.render('detailedstats', { title: 'SheffSenseV2: Detailed Statistics' });
});
router.get('/our-team', function (req, res) {
    res.render('our-team', { title: 'Our team' });
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

router.get('/airQualityIndex', async function (req, res) {
    const airQualityURL = "https://api.weather.com/v3/wx/globalAirQuality?geocode=53.383331,-1.466667&language=en-US&scale=DAQI&format=json&apiKey=" + req.query.key;
    try {
        var airQualityData = await requestify.get(airQualityURL)
        res.send(airQualityData.body)
    } catch (err){
        console.log(err);
    }
})

router.get('/weatherCompanyData', async function (req, res) {
    const weatherDataURL = "https://api.weather.com/v3/wx/forecast/hourly/2day?geocode=53.383331%2C-1.466667&format=json&units=e&language=en-US&apiKey=" + req.query.key
    try {
        var weatherData = await requestify.get(weatherDataURL)
        res.send(weatherData.body)
    } catch (err){
        console.log(err);
    }
})

router.get('/githubData', async function (req, res) {
    const githubURL = 'https://api.github.com/repos/dambem/ClimateMonitorV2/contents/ClimateMonitorV2/public/files/images?password=' + req.query.key
    try {
        var githubData = await requestify.get(githubURL)
        res.send(githubData.body)
    } catch (err) {
        console.log(err);
    }
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
    console.log(date)

    year = date.getFullYear();
    console.log(year)
    month = date.getMonth();
    if (month < 10) {
        month = "0" + month
    }
    console.log(month)
    day = date.getDay();
    if (day < 10) {
        day = "0" + day
    }
    console.log(day)
    link = "http://archive.sensor.community/" + year + "-" + month + "-" + day + "/" + year + "-" + month + "-" + day + "_" + "sds011_sensor_" + sensor_id + ".csv"
    return link
}
function build_link_from_date_manual(date, sensor_id) {
    date = date.toISOString()
    console.log(typeof (date))
    var link
    var year = date.substring(0, 4)
    var month = date.substring(5, 7)
    var day = date.substring(8, 10)

    link = "http://archive.sensor.community/" + year + "-" + month + "-" + day + "/" + year + "-" + month + "-" + day + "_" + "sds011_sensor_" + sensor_id + ".csv"
    console.log(link)
    return link
}

// Our post route for getting daily values
router.post('/index', function (req, res, next) {
    var full_link = req.body['date']
    var id = req.body['id']
    csvParsing(full_link).then((successMessage) => {
        res.send(successMessage)
    })
});
function csvParsing(link) {

    var options = {
        delimiter: ';', // default is ,
        endLine: '\n', // default is \n,
        columns: ['sensor_id', 'sensor_type', 'location', 'lat', 'lon', 'timestamp', 'P1', 'durP1', 'ratioP1', 'P2', 'durP2', 'ratioP2'] // by default read the first line and use values found as columns
    }

    var full_data = []
    return new Promise((resolve, reject) => {
        var csvStream = csv.createStream(options);
        request(link).pipe(csvStream)
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
}
router.post('/sensordetails', function (req, res, next) {
    var url = 'http://data.sensor.community/static/v2/data.1h.json'
    var items = [];
    var counter = 0;
    var req = request(url, function (res) {
        res.pipe(JSONStream.parse()).on('data', function (obj) {
            console.log(obj);
        });
    });
    req.end();
    })

router.post('/fromto', function (req, res, next) {
    var promises = []

    var sensor = req.body['id']
    var from = req.body['from']
    var to = req.body['to']
    console.log(from)
    console.log(to)
    var dates = []
    for (var d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
        var link = build_link_from_date_manual(new Date(d), sensor)
        console.log(link)
        dates.push(link)
        promises.push(csvParsing(link))

    }
    Promise.all(promises).then((results) => {
        res.send(results)

    }).catch((e) => {
            console.log(e)
     });


})
function getUrl(url, chosen_date, both) {
    return new Promise((resolve) => {
        requestify.get(url)
            .then(function (response) {
                if (both) {
                    resolve([chosen_date, true])
                }
                else {
                    resolve()
                }
            })
            .fail(function (response) {
                if (both) {
                    resolve([chosen_date, false])
                }
                else {
                    resolve(chosen_date)
                }
            })
    })

}
router.post('/checkdates', function (req, res, next) {
    var i
    var list_of_dates = []
    var id = req.body['id']
    var days = parseInt(req.body['days'])

    var promises = []
    for (i = 1; i < days; i++) {
        var chosen_date = new Date();
        chosen_date.setDate(chosen_date.getDate() - i)
        var url = build_link_from_date(chosen_date, id)
        promises.push(getUrl(url, chosen_date, true))
    }

    Promise.all(promises)
        .then((results) => {
            console.log(results)
            res.send(results)
        })
        .catch((e) => {
            console.log(e)
        });
})

router.post('/invaliddates', function (req, res, next) {
    var i
    var list_of_dates = []
    var id = req.body['id']
    var days = parseInt(req.body['days'])
    var promises = []
    for (i = 1; i < days; i++) {
        var chosen_date = new Date();
        chosen_date.setDate(chosen_date.getDate() - i)
        var url = build_link_from_date(chosen_date, id)
        promises.push(getUrl(url, chosen_date, false))
    }
    Promise.all(promises)
        .then((results) => {

            console.log(results)
            res.send(results)
        })
        .catch((e) => {
            console.log(e)
        });
})
module.exports = router;
