// This is the main file for the mapping, and sensor information
const data_values = [];
var items = [];
var date = new Date();

// Values for colours
var light = "#FFF275"
var medium = "#FF8C42"
var high = '#FF3C38'
var veryhigh = '#d600a4'
var danger = '#a20049'
var bigdanger = '#1a0006'
var safe = '#6699CC'

// Function for removing data from charts
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
// Function that returns different colours based on pollution 
function colorForPollution(pm10, pm2) {
    if (pm10 >= 20 && pm10 < 30 || pm2 >= 10 && pm2 < 15) {
        return light
    }
    else if (pm10 >= 30 && pm10 < 50 || pm2 >= 15 && pm2 < 25) {
        return medium
    }
    else if (pm10 >= 50 && pm10 < 70 || pm2 >= 25 && pm2 < 35) {
        return high
    }
    else if (pm10 >= 70 || pm2 >= 35) {
        return veryhigh
    }
    else if (pm10 >= 100 || pm2 >= 50) {
        return danger
    }
    else if (pm10 >= 150 || pm2 >= 75) {
         return bigdanger
    }
    else {
        return safe
    }
}

// This function builds the link to the sensor given a certain date.
function build_link_from_date(date) {
    year = date.getFullYear();
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
    link = "http://archive.sensor.community/" + year + "-" + month + "-" + day + "/" + year + "-" + month + "-" + day + "_" + "sds011_sensor_20978.csv"
    console.log(link)
    return link
}

// Everything required once loaded
$(document).ready(() => {
    var pm2Chart = document.getElementById('pm2Chart').getContext('2d');
    var pm10Chart = document.getElementById('pm10Chart').getContext('2d');
    var testChart = document.getElementById('testChart').getContext('2d');
    var testChart = new Chart(testChart, {
        type: 'scatter',
        data: {
            labels: ["pm10", "pm2.5"],
            datasets: [{
                label: 'Within guidelines',
                data: [{ x: 0.5, y: 0.5 },
                        {x:0.6, y:0.6}]
            }], 
        },
        options: {
            title: { display: true, text: "Effects of PM10 and PM2.5 on Long and Short Term Mortality (LTM, STM)" },
            scales: {
                yAxes: [{ ticks: { beginAtZero: true } }],
                xAxes: [{ stacked: true }]
            }
        }
    })
    console.log(testChart.data)
    var scatterChartPM2 = new Chart(pm2Chart, {
        type: 'scatter',
        data: {

        },
/*        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    position: 'bottom',
                    time: {
                        unit: 'day'
                    }
                }]
            }
        },*/
    })
    var scatterChartPM10 = new Chart(pm10Chart, {
        type: 'scatter',
        data: {
            datasets: [{

            }]
        },
/*        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    position: 'bottom',
                    time: {
                        unit: 'hour'
                    }
                }]
            }
        },*/
    })
    // Create the pollution chart 
    var ctx = document.getElementById("pollutionChart").getContext('2d');
    var pollutionGuidelinesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["pm10", "pm2.5"],
            datasets: [
                { label: 'Within guidelines', data: [20, 10], backgroundColor: [safe, safe], borderWidth: 1 },
                { label: '3% Increase In LTM', data: [30, 15], backgroundColor: [light, light,], borderWidth: 1 },
                { label: '9% Increase In LTM', data: [50, 25], backgroundColor: [medium, medium], borderWidth: 1 },
                { label: '15% Increase in LTM', data: [75, 37.5], backgroundColor: [high, high], borderWidth: 1 },
                { label: '1.2% Increase In STM, 15% Increase in LTM', data: [100, 50], backgroundColor: [veryhigh, veryhigh], borderWidth: 1 },
                { label: '2.5% Increase In STM, 15% Increase in LTM', data: [150, 75], backgroundColor: [danger, danger], borderWidth: 1 },
                { label: '5% Increase In STM, 15% Increase in LTM', data: [175, 175], backgroundColor: [bigdanger, bigdanger], borderWidth: 1 }]
        },
        options: {
            title: { display: true, text: "Effects of PM10 and PM2.5 on Long and Short Term Mortality (LTM, STM)" },
            scales: {
                yAxes: [{ ticks: { beginAtZero: true } }],
                xAxes: [{ stacked: true }]
            }
        }
    });
    // Displays current date on top of map (for debugging uses)
    $('#currentdate').text(date)

    // Creates options for the initial sensor map
    var sensorMap = L.map('mapid', {
        minZoom: 12,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    })
    // This builds the actual map.
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Sensor Data <a href="https://luftdaten.info/en/home-en/">Luftdaten</a> | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: config.MAP_KEY
    }).addTo(sensorMap);
    // Localises the view to go to Sheffield
    sensorMap.setView([53.382, -1.47], 13);
    var slider = document.getElementById("myRange")
    var output = document.getElementById("value")

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        current_date = new Date();
        current_date.setDate(current_date.getDate() + parseInt(this.value))
        output.innerHTML = current_date;
    }
    // Once slider is released, goes to the date chosen.
    slider.onmouseup = function () {
        current_date = new Date();
        current_date.setDate(current_date.getDate() + parseInt(this.value))
        link = build_link_from_date(current_date)
        getData(link)
    }

    function getRequest() {
        $.ajax({
            url: chosen_url,
            data: '',
            contentType: 'application/json',
            type: 'GET',
            success: function (dataR) {
                var ret = dataR;
                console.log("Everything")
                console.log(ret)
            },
            complete: function (data, res) {
                console.log(res)
                console.log("Fully Complete")
            },
            error: function (xhr, status, error) {
                console.log(error.message)
            },
            // shows the loader         
            beforeSend: function () { $body.addClass("loading"); },
            complete: function () { $body.removeClass("loading"); },     
        })
    }
    function getData(dateSent) {
        jsonData = {date:dateSent}
        $body = $("body");
        $.ajax({
            url: '/index',
            data: JSON.stringify(jsonData),
            contentType: 'application/json',
            type: 'POST',
            success: function (dataR) {
                var ret = dataR
                console.log("Success Hit")
                updateGraph(ret)
            },
            complete: function (data, res) {
                console.log("Complete Hit")
                console.log(res)
                $body.removeClass("loading");
            },
            error: function (xhr, status, error) {
                console.log(error.message);
            },
             // shows the loader         
            beforeSend: function () { $body.addClass("loading");   },
        })
    }

    function updateGraph(data) {

        var i;
        label2 = "PM2.5 Values"
        var pm2Data = []
        var pm10Data = []
        var pm2Color = []
        var pm10Color = []
        for (i = 1; i < 2; i++) {
            date = new Date(data[i]['timestamp'])
            pm2 = { x: 0, y: parseFloat(data[i]['P2'])/100}
            pm10 = { x: 0, y: parseFloat(data[i]['P1'])/100}
            pm2Color.push('green')
            pm10Color.push('red')
            pm2Data.push(pm2)
            pm10Data.push(pm10)
            scatterChartPM2.data.datasets.label = "PM2 Values"
            scatterChartPM10.data.datasets.label = "PM10 Values"
            scatterChartPM10.data.datasets.push(pm10)
            scatterChartPM2.data.datasets.push(pm2)
        }
        console.log(scatterChartPM10.data)
        scatterChartPM10.update()
        scatterChartPM2.update()
        

    }
    var json = $.getJSON('http://api.luftdaten.info/static/v2/data.24h.json', function (data) {
        var counter = 0
        $.each(data, function (key, val) {
            if ((val.location.longitude > -1.58) && (val.location.longitude < -1.34) && (val.location.latitude <= 53.468) && (val.location.latitude >= 53.29)) {
                if (val.sensordatavalues[0].value_type == "P1") {
                    items.push([key, val.location.latitude, val.location.longitude, val.sensordatavalues[0].value, val.sensordatavalues[1].value, val.sensor.id, val.sensor.sensor_type.name]);
                }
            }
            counter++;
        });
        $('input[name="dates"]').daterangepicker();
        circles = []
        for (var i = 0; i < items.length; i++) {
            color = colorForPollution(items[i][3], items[i][4])
            circles.push(L.circle([items[i][1], items[i][2]], {
                color: 'black',
                fillColor: color,
                fillOpacity: 0.8,
                radius: 150,
                p10: [items[i][3]],
                p2: [items[i][4]],
                choice_id: i
            }).addTo(sensorMap));
        }
        for (var i = 0; i < circles.length; i++) {
            circles[i].bindPopup("<h4><b>Past 24 Hour Average</b></h4><h4>pm10: " + items[i][3] + "</h4> <h4>pm2.5: " + items[i][4] + "</h4><p></p> <h3> Sensor ID </h3>" +items[i][5]);
            data_values.push([items[i][0], items[i][1]]);
            circles[i].on('click', function (event) {
                circle_chosen = event.target.options.choice_id
            })
        }


    });
});
