// Everything required once loaded
$(document).ready(() => {
    var pm2Chart = document.getElementById('pm2Chart').getContext('2d');

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
}