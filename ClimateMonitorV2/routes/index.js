'use strict';
var express = require('express');
const { StringStream } = require("scramjet");

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

router.post('/', function (req, res) {
    try {
        http.get("http://archive.luftdaten.info/2020-01-04/2020-01-04_sds011_sensor_20978.csv")
            .pipe(new StringStream())
            .CSVParse()
            .consume(object => console.log("Row:", object))
            .then(() => console.log("All Done"))
        console.log("test")
    }catch(error){
        console.log(error)
    }
})

module.exports = router;
