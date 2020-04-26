'use strict';
var express = require('express');
const { StringStream } = require("scramjet");

var router = express.Router();
var bodyParser = require("body-parser");
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'SheffSenseV2: Sheffield Climate Monitor' });
});

router.post('/', function (req, res,next) {
    var userDataArray = req.body;
    // Set the headers
    var headers = {
        'User-Agent': 'me me me',
        'Content-Type': 'application/json'
    }
    // Configure the request
    var options = {
        url: 'http://localhost:3001/index',
        method: 'POST',
        headers: headers,
    }

    counter = 0;
    for (index in userDataArray) {
        options.json = userDataArray[index];
        // Start the request
        request(options,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    userDataArray[counter] = body;
                    // Print out the response body
                    if (++counter >= userDataArray.length) {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(userDataArray));
                    }
                }

            });
    }
})

module.exports = router;
