const data_values = [];
var items = [];
function sendAjaxQuery(url, data) {
    const input = JSON.stringify(data);
    $.ajax({
        url: url,
        data: input,
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            var ret = dataR;
            console.log(ret)
        },
        complete: function (data, res) {
            console.log(data)
            console.log(res)
        },
        error: function (xhr, status, error) {
            alert('Error!' + error.message);
        }
    })
}

function testAjax() {
    data ='{"menu": { "id": "file","value": "File",  "popup": {"menuitem": [{ "value": "New", "onclick": "CreateNewDoc()" },{ "value": "Open", "onclick": "OpenDoc()" },{ "value": "Close", "onclick": "CloseDoc()" }]}}}'
    sendAjaxQuery('/index', JSON.parse(data))
}

function testLocalParse() {
    sendAjaxQuery('/local', "foo")
}
$(document).ready(() => {
    var date = new Date();
    var slider = document.getElementById("myRange")
    var output = document.getElementById("value")
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        current_date = new Date();
        current_date.setDate(current_date.getDate() + parseInt(this.value))
        output.innerHTML = current_date;
    }
    slider.onmouseup = function () {
        current_date = new Date();
        current_date.setDate(current_date.getDate() + parseInt(this.value))
        console.log(current_date)
        link = build_link_from_date(current_date)
        full_link = link + "20978.csv"
        build_csv(full_link)
    }

    function build_link_from_date(date) {
        year = date.getFullYear();
        console.log(year)
        month = date.getMonth();
        if (month < 10) {
            month = "0"+month
        }
        console.log(month)
        day = date.getDay();
        if (day < 10) {
            day = "0"+day
        }
        console.log(day)
        link = "http://archive.luftdaten.info/" + year + "-" + month + "-" + day + "/" + year + "-" + month + "-" + day + "_" +"sds011_sensor_20978.csv"
        console.log(link)
        return link
    }

    function build_csv(link) {
        console.log("Building CSV")
        $.post("/", function (data, status) {
            alert("Data:" +data + "\nStatus:" +status)
        })
    }
    function print_all() {
        for (var i = 0; i < items.length; i++) {

        }
    }
    $('#currentdate').text(date)
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
        console.log($('input[name="dates"]'))
        var mymap = L.map('mapid').setView([51.505, -0.09], 13);
        mymap.setView([53.382, -1.47], 13);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Sensor Data <a href="https://luftdaten.info/en/home-en/">Luftdaten</a> | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiZGFtYmVtIiwiYSI6ImNrOWJhZzNkYjAzdmEzZW14Zjgxdmk3aHoifQ.ZHdBdk1Gh5hfX4uxURjsHA'
        }).addTo(mymap);
        circles = []
        var light = "#FFF275"
        var medium = "#FF8C42"
        var high = '#FF3C38'
        var veryhigh = '#d600a4'
        var danger = '#a20049'
        var bigdanger = '#1a0006'
        var safe = '#6699CC'
        for (var i = 0; i < items.length; i++) {
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
            circles[i].bindPopup("<h4><b>Past 24 Hour Average</b></h4><h4>pm10: " + items[i][3] + "</h4> <h4>pm2.5: " + items[i][4] + "</h4><p></p> <h3> Sensor ID </h3>" +items[i][5] );
            data_values.push([items[i][0], items[i][1]]);
            circles[i].on('click', function (event) {
                circle_chosen = event.target.options.choice_id

            })
        }
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["pm10", "pm2.5"],
                datasets: [
                    {label: 'Within guidelines',data: [20, 10],backgroundColor: [safe,safe],borderWidth: 1},
                    {label: '3% Increase In LTM',data: [30, 15],backgroundColor: [light,light,],borderWidth: 1},
                    {label: '9% Increase In LTM',data: [50, 25],backgroundColor: [medium,medium],borderWidth: 1},
                    {label: '15% Increase in LTM',data: [75, 37.5],backgroundColor: [high,high],borderWidth: 1},
                    {label: '1.2% Increase In STM, 15% Increase in LTM',data: [100, 50],backgroundColor: [veryhigh,veryhigh],borderWidth: 1},
                    {label: '2.5% Increase In STM, 15% Increase in LTM',data: [150, 75],backgroundColor: [danger,danger],borderWidth: 1},
                    {label: '5% Increase In STM, 15% Increase in LTM',data: [175, 175],backgroundColor: [bigdanger,bigdanger],borderWidth: 1}]},
            options: {
                title: {display: true,text: "Effects of PM10 and PM2.5 on Long and Short Term Mortality (LTM, STM)"},
                scales: {
                    yAxes: [{ticks: {beginAtZero: true}}],
                    xAxes: [{stacked: true}]
                }
            }
        });
    });
});

