/* eslint-env jquery, browser */
const data_values = [];

$(document).ready(() => {
    var items = [];
    console.log("running")


    var json = $.getJSON('http://api.luftdaten.info/static/v2/data.24h.json', function (data) {
        var counter = 0
        console.log("grabbingdata")
        $.each(data, function (key, val) {
            if ((val.location.longitude > -1.58) && (val.location.longitude < -1.34) && (val.location.latitude <= 53.468) && (val.location.latitude >= 53.29)) {
                if (val.sensordatavalues[0].value_type == "P1") {
                    items.push([key, val.location.latitude, val.location.longitude, val.sensordatavalues[0].value, val.sensordatavalues[1].value, val.sensor.id, val.sensor.sensor_type.name]);

                }
            }
            counter++;
        });
        var mymap = L.map('mapid', {
            minZoom: 12,
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: 'topleft'
            }
        })
        navigator.geolocation.getCurrentPosition(function (location) {
            var userlocation = new L.LatLng(location.coords.latitude, location.coords.longitude);
            var marker = L.marker(userlocation).addTo(mymap);
        });
        mymap.setView([53.382, -1.47], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Sensor Data <a href="https://luftdaten.info/en/home-en/">Luftdaten</a> | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiZGFtYmVtIiwiYSI6ImNqczgyZmZ3MzEzOTMzeXJuODFmbjRrbjYifQ.cerkLIWoRAz2aGASHP_VaQ'
        }).addTo(mymap);
        console.log(items)
        circles = []
        var light = "#FFF275"
        var medium = "#FF8C42"
        var high = '#FF3C38'
        var veryhigh = '#d600a4'
        var danger = '#a20049'
        var bigdanger = '#1a0006'
        var safe = '#6699CC'
        for (var i = 0; i < items.length; i++) {
            console.log(items[i][3])
            console.log(items[i][4])
            if (items[i][3] >= 20 && items[i][3] < 30 || items[i][4] >= 10 && items[i][4] < 15) {
                colour = light
            }
            else if (items[i][3] >= 30 && items[i][3] < 50 || items[i][4] >= 15 && items[i][4] < 25) {
                colour = medium
            }
            else if (items[i][3] >= 50 && items[i][3] < 70 || items[i][4] >= 25 && items[i][4] < 35) {
                colour = high
            }
            else if (items[i][3] >= 70 || items[i][4] >= 35) {
                colour = veryhigh
            }
            else if (items[i][3] >= 100 || items[i][4] >= 50) {
                colour = danger
            }
            else if (items[i][3] >= 150 || items[i][4] >= 75) {
                colour = bigdanger
            }
            else {
                colour = safe
            }
            circles.push(L.circle([items[i][1], items[i][2]], {
                color: 'black',
                fillColor: colour,
                fillOpacity: 0.8,
                radius: 150,
                p10: [items[i][3]],
                p2: [items[i][4]],
                choice_id: i
            }).addTo(mymap));
        }
        for (var i = 0; i < circles.length; i++) {
            circles[i].bindPopup("<h4><b>Past 24 Hour Average</b></h4><h4>pm10: " + items[i][3] + "</h4> <h4>pm2.5: " + items[i][4] + "</h4><p></p>");
            data_values.push([items[i][0], items[i][1]]);
            circles[i].on('click', function (event) {
                circle_chosen = event.target.options.choice_id

            })
        }

        var popup = L.popup()
            .setLatLng([53.382, -1.47])
            .setContent("<b>Click on a circle to view sensor info</b>")
            .openOn(mymap);

        temp = []
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',

            data: {
                labels: ["pm10", "pm2.5"],
                datasets: [
                    {
                        label: 'Within guidelines',
                        data: [20, 10],
                        backgroundColor: [
                            safe,
                            safe
                        ],

                        borderWidth: 1
                    },
                    {
                        label: '3% Increase In LTM',
                        data: [30, 15],
                        backgroundColor: [
                            light,
                            light,
                        ],

                        borderWidth: 1
                    },
                    {
                        label: '9% Increase In LTM',
                        data: [50, 25],
                        backgroundColor: [
                            medium,
                            medium
                        ],

                        borderWidth: 1
                    }
                    ,
                    {
                        label: '15% Increase in LTM',
                        data: [75, 37.5],
                        backgroundColor: [
                            high,
                            high
                        ],

                        borderWidth: 1
                    },
                    {
                        label: '1.2% Increase In STM, 15% Increase in LTM',
                        data: [100, 50],
                        backgroundColor: [
                            veryhigh,
                            veryhigh
                        ],

                        borderWidth: 1
                    },
                    {
                        label: '2.5% Increase In STM, 15% Increase in LTM',
                        data: [150, 75],
                        backgroundColor: [
                            danger,
                            danger
                        ],

                        borderWidth: 1
                    },
                    {
                        label: '5% Increase In STM, 15% Increase in LTM',
                        data: [175, 175],
                        backgroundColor: [
                            bigdanger,
                            bigdanger,
                        ],

                        borderWidth: 1
                    },]
            },
            options: {

                title: {
                    display: true,
                    text: "Effects of PM10 and PM2.5 on Long and Short Term Mortality (LTM, STM)"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: true
                    }]
                }
            }
        });

        console.log("before")
        last7 = Array(7);
        $.each(items, function (key, val) {
            temp = []
            $.each(last7, function (key2, val2) {
                console.log(key)
                var date = new Date();
                date.setDate(date.getDate() - (key2 + 1));
                yesterdays_date = date.toJSON()
                correct_date = yesterdays_date.substring(0, 10)
                url = "http://archive.luftdaten.info/" + correct_date + "/" + correct_date + "_" + (val[6]).toLowerCase() + "_sensor_" + val[5] + ".csv"
                console.log(url)
                temp.push[date, url]
            });
        });
    });


});