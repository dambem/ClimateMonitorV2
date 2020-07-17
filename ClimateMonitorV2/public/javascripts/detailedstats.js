// Everything required once loaded
$(document).ready(() => {
    multi_date_search(new Date("2020-04-01"), new Date("2020-04-29"), 24239)
    function multi_date_search(fromDate, toDate, sensorID) {
        console.log("Going into multi-date-search")
        jsonData = { from: fromDate, to: toDate, id: sensorID }
        $.ajax({
            url: '/fromto',
            data: JSON.stringify(jsonData),
            contentType: 'application/json',
            type: 'POST',
            success: function (dataR) {
                var ret = dataR
                console.log("Success Hit")
                updateGraphMultiDay(ret)
            },
            complete: function (data, res) {
                console.log("Complete Hit")
                console.log(res)
                //$body.removeClass("loading");
            },
            error: function (xhr, status, error) {
                console.log(error.message);
            },
            // shows the loader         
            beforeSend: function () { //$body.addClass("loading"); 
            },

        })
    }
    function updateGraphMultiDay(data) {
        var i;
        label2 = "PM2.5 Values"
        var pm2Data = []
        var pm10Data = []
        var pm2Color = []
        var pm10Color = []
        scatterChartPM10.data.datasets = []
        scatterChartPM2.data.datasets = []
        console.log(data)
        if (data.length == 0) {
            alert("Sorry, the data wasn't found!")
        } else {
            for (j = 1; j < data.length; j++) {
                console.log(data[j])
                new_data = data[j]
                for (i = 1; i < new_data.length; i++) {
                    date = new Date(new_data[i]['timestamp'])
                    pm2 = { x: date, y: parseFloat(new_data[i]['P2']) }
                    pm10 = { x: date, y: parseFloat(new_data[i]['P1']) }
                    pm2Color.push('green')
                    pm10Color.push('red')
                    pm2Data.push(pm2)
                    pm10Data.push(pm10)
                }
            }
            scatterChartPM10.data.datasets.push({ label: "Pm10 Data", data: pm10Data, backgroundColor: 'red' })
            scatterChartPM2.data.datasets.push({ label: "Pm2 Data", data: pm2Data, backgroundColor: 'blue' })
            scatterChartPM10.update()
            scatterChartPM2.update()
        }

    }
    var pm2Chart = document.getElementById('detailedstats').getContext('2d');
    var pm10Chart = document.getElementById('detailedstats2').getContext('2d');

    var scatterChartPM2 = new Chart(pm2Chart, {
        type: 'scatter',
        data: {
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    position: 'bottom',
                    time: {
                        unit: 'day'
                    }
                }]
            }
        },
    })
    var scatterChartPM10 = new Chart(pm10Chart, {
        type: 'scatter',
        data: {
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    position: 'bottom',
                    time: {
                        unit: 'day'
                    }
                }]
            }
        },
    })
});