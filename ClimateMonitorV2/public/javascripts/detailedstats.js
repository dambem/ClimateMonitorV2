// Everything required once loaded

$(document).ready(() => {
    /**
    * Multi_date_search, throws a call to the backend to search through multiple dates for sensor details given a sensor id.
    * @param {Date} fromDate - Average PM10 Value
    * @param {Date} toDate - Average PM2 Value
    * @param {int} sensorID - Amount of people this is for
    */
    function multi_date_search(fromDate, toDate, sensorID) {
        console.log("Going into multi-date-search")
        $body = $("body");

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
                $body.removeClass("loading");
            },
            error: function (xhr, status, error) {
                console.log(error.message);
            },
            // shows the loader         
            beforeSend: function () {
                $body.addClass("loading");
            },

        })
    }
    multi_date_search(new Date("2020-04-01"), new Date("2020-04-29"), 24239)

    function updateGraphMultiDay(data) {
        var i;
        label2 = "PM2.5 Values"
        var pm2DatePlotly = []
        var pm2DataPlotly = []
        var pm10DatePlotly = []
        var pm10DataPlotly = []
        if (data.length == 0) {
            alert("Sorry, the data wasn't found!")
        } else {
            for (j = 1; j < data.length; j++) {
                new_data = data[j]
                for (i = 1; i < new_data.length; i++) {
                    date = new Date(new_data[i]['timestamp'])
                    p2Time = parseFloat(new_data[i]['P2']) 
                    p1Time = parseFloat(new_data[i]['P1']) 
                    pm2DatePlotly.push(date)
                    pm2DataPlotly.push(p2Time)
                    pm10DatePlotly.push(date)
                    pm10DataPlotly.push(p1Time)
                }
            }
        }
 
        var trace1 = {
            x: pm2DatePlotly,
            y: pm2DataPlotly,
            type: 'scatter',
            name: 'PM2 Data'
          };
          
          var trace2 = {
            x: pm10DatePlotly,
            y: pm10DataPlotly,
            type: 'scatter',
            name: 'PM10 Data'
          };

          var data = [trace1, trace2];
          var dataPM2 = [trace1];
          var dataPM10 = [trace2];
          var layout = {
              title: 'PM2 and PM10 data combined',
              xaxis: {
                  title: 'Timeframe'
              },
              yaxis: {
                  title: 'PM Values'
              },
          };
          var layoutPM2 = {
            title: 'PM2 data',
            xaxis: {
                title: 'Timeframe'
            },
            yaxis: {
                title: 'PM2 Values'
            },
        };
    
          var layoutPM10 = {
              title: 'PM10 data',
              xaxis: {
                title: 'Timeframe'
            },
            yaxis: {
                title: 'PM10 Values'
            },
        };
          
          Plotly.newPlot('graphtest', data, layout);
          Plotly.newPlot('graphtest2', dataPM2, layoutPM2);
          Plotly.newPlot('graphtest3', dataPM10, layoutPM10);
    }
});