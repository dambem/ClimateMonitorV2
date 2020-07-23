// This is the main file for the mapping, and sensor information
const data_values = [];
var items = [];
var date = new Date();
var chosen_date = new Date();
var sensor_id = 0;
// Values for colours
var light = "#FFF275"
var medium = "#FF8C42"
var high = '#FF3C38'
var veryhigh = '#d600a4'
var danger = '#a20049'
var bigdanger = '#1a0006'
var safe = '#6699CC'
var average_pm2
var average_pm10
import gauge from "./gauge.js"
/**
 * Currently inactive function to calculate percentage danger based on PM2/PM10 (different than mortality as this is respiratory disease)
 * @param {float} PM10 - Average PM10 Value
 * @param {float} PM2 - Average PM2 Value
 * @param {int} people - Amount of people this is for
 * @param {string} id - The id of the div element we're using. (Currently inactive!)
 */
function dangerBasedOnPM(PM10, PM2, people, id) {
    var validPM10 = 20
    var validPM2 = 15
    people = 1000
    var PM10inc = (PM10 - validPM10) / 10
    var PM2inc = (PM2 - validPM2) / 10

    var percentageMortalityPM10 = 0.58 * PM10inc
    var percentageRespDiseasePM2 = 2.07 * PM2inc
    var lifespandecreasePM2 = 0.35 * PM2inc
    console.log(percentageMortalityPM10)
    console.log(percentageRespDiseasePM2)
    console.log(lifespandecreasePM2)
    var mortalityOnPeoplePM10 = people * (percentageMortalityPM10 * 0.01)
    var respiratoryDiseasePeoplePM2 = people * (percentageMortalityPM10 * 0.01)
}
/**
 * Mortality calculation for the pollution values
 * @param {float} PM10 - Average PM10 Value
 * @param {float} PM2 - Average PM2 Value
 * @param {int} people - Amount of people this is for
 * @param {string} id - The id of the div element we're using. (Currently inactive!)
 * @param {string} preface - A text preface to add some information
 */
function mortality(PM10, PM2, people, id, preface) {
    console.log("Entering Mortality")
    var validPM10 = 20
    var validPM2 = 15
    var PM10inc = (PM10 - validPM10) / 10
    var PM2inc = (PM2 - validPM2) / 10
    if ( PM10inc <= 0 ) {
        var mortalityOnPeoplePM10 = 0
    } else {
        var percentageMortalityPM10 = 0.58 * PM10inc
        var mortalityOnPeoplePM10 = people * (percentageMortalityPM10 * 0.01)
    }
    if (PM2inc <= 0 ) {
        var mortalityOnPeoplePM2 = 0
    } else {
        var percentageMortalityPM2 = 2.8 * PM2inc
        var mortalityOnPeoplePM2 = people * (percentageMortalityPM2 * 0.01)
    }
    human_display(people, mortalityOnPeoplePM10 + mortalityOnPeoplePM2, id, preface)
}

/**
 * Fractional reducer, to try and get large fractions into small, simple fractions
 * @param {float} numerator - The numerator 
 * @param {float} denominator - the denominator
 * @returns {array} A simpler fraction with the numerator and denominator
 */
function fractionalreducer(numerator, denominator) {
    var gcd = function gcd(a, b) {
        return (b ? gcd(b,a%b) : a)
    }
    gcd = gcd(numerator, denominator)
    return [numerator/gcd, denominator/gcd]
}

function human_display(people, infected,  id, preface) {
    if (preface == null) {
        preface = "<p></p>"
    } else {
        preface = "<p>" + preface + "</p>"
    }

    $(id).empty()
    console.log("Infected people" + infected)
    console.log("Healthy people:" + people)
    $(id).append(preface)
    //fractions = fractionalreducer(people, infected)

    //healthy = fractions[0]
    //infected = fractions[1]
    $(id).append("<p> Out of " + String(people) + " people, " + String(infected) + " would sadly lose their lives due to pollution.")

    for (var i = 0; i < (people-infected); i++) {
        $(id).append(`
            <svg
                id="healthy_person"
                class="bi bi - person - fill"
                width="2em"
                height="2em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                />
            </svg >
        `)
    }
    
    for (i = 0; i < infected; i++) {
        $(id).append(`
            <svg
                id="infected_person"
                class="hvr-pulse-shrink"
                width="2em"
                height="2em"
                viewBox="0 0 16 16"
                fill="red"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                />
            </svg >
        `)
    }
    
    
}

// Function for removing data from charts
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function linkExist(id) {
        jsonData = {'id': id}
        $.ajax({
            url: '/checkdates',
            data: JSON.stringify(jsonData),
            contentType: 'application/json',
            type: 'POST',
            success: function (dataR) {
                var ret = dataR;
                console.log("Everything")
                console.log(ret)
            },
            error: function (error) {
                console.log(error)
            }
        })
}

// Function that returns different phrase based on pollution 
function colorForPollutionPhrase(pm10, pm2) {
    if (pm10 >= 20 && pm10 < 30 || pm2 >= 10 && pm2 < 15) {
        return "The pollution levels are just above WHO guidelines for safe pollution, and can lead to long term health issues"
    }
    else if (pm10 >= 30 && pm10 < 50 || pm2 >= 15 && pm2 < 25) {
        return "The pollution levels are above WHO guidelines for safe pollution, and can lead to long term health issues"
    }
    else if (pm10 >= 50 && pm10 < 70 || pm2 >= 25 && pm2 < 35) {
        return "The pollution levels are above WHO guidelines for safe pollution, and can lead to long term health issues"
    }
    else if (pm10 >= 70 && pm10 < 100 || pm2 >= 35 && pm2 < 50) {
        return "The pollution levels are above WHO guidelines for safe pollution, and can lead to long term health issues"
    }
    else if (pm10 >= 100 && pm10 < 150 || pm2 >= 50 && pm2 < 75) {
        return "The pollution levels are dangerously above WHO guidelines for safe pollution, and can lead to long <b> and </b> short term health issues"
    }
    else if (pm10 >= 150 || pm2 >= 75) {
        return "The pollution levels are <b> dangerously </b> above WHO guidelines for safe pollution, and can lead to long and short term health issues"
    }
    else {
        return "The pollution levels are currently within WHO guidelines!"
    }
}
/*

/*
* Function that returns different colours based on pollution
*/ 
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
    else if (pm10 >= 70 && pm10 < 100 || pm2 >= 35 && pm2 < 50) {
        return veryhigh
    }
    else if (pm10 >= 100 && pm10 < 150 || pm2 >= 50 && pm2 < 75) {
        return danger
    }
    else if (pm10 >= 150 || pm2 >= 75) {
        return bigdanger
    }
    else {
        return safe
    }
}

/* 
* This function builds the link to the sensor CSV given a certain date.
*/
function build_link_from_date(date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;

    if (month < 10) {
        month = "0" + month
    }
    day = date.getDate();
    if (day < 10) {
        day = "0" + day
    }
    link = "http://archive.sensor.community/" + year + "-" + month + "-" + day + "/" + year + "-" + month + "-" + day + "_" + "sds011_sensor_" + sensor_id + ".csv"
    console.log(link)
    return link
}

function currentWeatherDisplay() {
    const weatherDataURL = "https://api.weather.com/v3/wx/forecast/hourly/2day?geocode=53.383331%2C-1.466667&format=json&units=e&language=en-US&apiKey=" + config.WEATHER_COMPANY_KEY
    $.get(weatherDataURL,
    function(weatherData){
        const currentTemp = weatherData.temperature[0];
        const currentTempCelcius = Math.floor((5/9) * (currentTemp - 32));
        const currentWindSpeed = weatherData.windSpeed[0];
        const currentIconCode = weatherData.iconCode[0];
        $('#currentTemp').html(currentTempCelcius +'ºC');
        $('#currentWind').html(currentWindSpeed + 'mph');
        $('#weather-image').attr('src', '../files/weather-icons/' + currentIconCode + '.png');
        $('#weather-image').attr('alt', 'A forecast-style weather icon for the current weather conditions');
    });
}

function currentAirQualityDisplay() {
    // get air quality data from weather company API
    const airQualityURL = "https://api.weather.com/v3/wx/globalAirQuality?geocode=53.383331,-1.466667&language=en-US&scale=DAQI&format=json&apiKey=" + config.WEATHER_COMPANY_KEY
    $.get(airQualityURL,
    function(airQuality){
        const currentAQI = airQuality.globalairquality.airQualityIndex;
        const currentCategory = airQuality.globalairquality.airQualityCategory;
        const currentMessage = airQuality.globalairquality.messages.General.text;

        // Set values for HTML attributes
        $('#aqi-header').html("Air Quality Index Average")
        $('#currentAQI').html(`<b><strong>${currentAQI}</strong></b>`);
        $('#currentCategory').html(currentCategory + ': ' + currentMessage);
        console.log(airQuality);

        // Set up gauge for AQI
        var powerGauge = gauge("#power-gauge", {
            size: 300,
            clipWidth: 300,
            clipHeight: 300,
            ringWidth: 60,
            maxValue: 500,
            transitionMs: 4000, // changed
        });
            // Render gauge
            powerGauge.render();
        
            // Set gauge reading to current AQI
            function updateReadings(currentAQI) {
                powerGauge.update(currentAQI);
            }
        
        updateReadings(currentAQI);

        // Get average values of PM10 and PM2.5 for Sheffield
        var average_pm10 = airQuality.globalairquality.pollutants.PM10.amount;
        var average_pm2 = airQuality.globalairquality.pollutants["PM2.5"].amount;

        // Set values for average PM10 levels
        $('#pm10averagetotal').html(`<u><strong>${average_pm10}</strong></u>`)
        var currentpm10Colour = colorForPollution(average_pm10, 0)
        $('#pm10averagetotal').css("color", currentpm10Colour)
        $('#pm10averageheader').html("PM10 Average")
        $('#pm10averageheader').css("color", currentpm10Colour)
        $('#pm10averagedesc').html(colorForPollutionPhrase(average_pm10, 0))

        // Set values for avergae PM2.5 levels
        $('#pm2averagetotal').html(`<u><strong>${average_pm2}</strong></u>`)
        var currentpm2Colour = colorForPollution(average_pm2, 0)
        $('#pm2averagetotal').css("color", currentpm2Colour)
        $('#pm2averageheader').html("PM2.5 Average")
        $('#pm2averageheader').css("color", currentpm2Colour)
        $('#pm2averagedesc').html(colorForPollutionPhrase(0, average_pm2))

        console.log("Here");
        // appends danger_level div with certain human displays
        mortality(average_pm10, average_pm2, 500, "#mortality_pm10", "The current PM10 value is expected to cause the following increases in mortality over an average of 1000 people")
        console.log("here again");
        dangerBasedOnPM(average_pm10, average_pm2, 100)
    });
}

// Everything required once loaded
$(document).ready(() => {

    // Activate Carousel
    $('#pythongraphslideshow').carousel({ interval: 3000 });

    $.ajax({
        url: 'https://api.github.com/repos/dambem/ClimateMonitorV2/contents/ClimateMonitorV2/public/files/images',
        type: 'GET',
        contentType: 'application/json',
        password: config.GITHUB_API_TOKEN,
        success: function (files) {
            var images = []

            // Get image links
            files.forEach(function (file) {

                // Only extract images
                if (file["name"].includes(".png", file["name"].length - 5)) {               
                    
                    console.log(`INFO: Importing ${file["name"]}...`)
                    images.push(file['download_url'])

                }

            });
            
            if (images.length == 0) {
                alert("WARNING: No png images were found at ClimateMonitorV2/public/files/images\nGraph carosuel will be empty")
            }
            
            // Compile the indicators first
            for (var currentCount = 1; currentCount < images.length; ++currentCount) {
                var listItemNode = document.createElement("LI")
                listItemNode.setAttribute("data-target", "#pythongraphslideshow")
                listItemNode.setAttribute("data-slide-to", currentCount)

                document.getElementById("graph_carousel_indicators").appendChild(listItemNode)
            }

            // Populate the carosuel
            var altText = "Graph unavailble. Please check your GITHUB_API_TOKEN"
            var activeImage = false
            var imageCount = 0

            images.forEach( function (image) {

                if (!activeImage) {
                    $(`#carosuel_items`).append(
                        `
                        <div class="carousel-item active">
                            <a 
                                target="_blank"
                                href="${image}"
                            >
                                <img
                                    src="${image}"
                                    alt="${altText}"
                                    width="100%"
                                    height="100%"
                                >
                            </a>
                        </div>
                        `
                    )
                    activeImage = true
                    imageCount++

                } else {
                    // Use a counter to make each class unique
                    $(`#carosuel_items`).append(
                        `
                        <div class="carousel-item ${imageCount}">
                            <a 
                                target="_blank"
                                href="${image}"
                            >
                                <img
                                    src="${image}"
                                    alt="${altText}"
                                    width="100%"
                                    height="100%"
                                >
                            </a>
                        </div>
                        `
                    )
                    imageCount++

                }
                
            });

        },
        error: function (error) {
            console.log(error)
        }
    })
  
    currentWeatherDisplay();
    currentAirQualityDisplay();
  
    var pm2Chart = document.getElementById('pm2Chart').getContext('2d');
    var pm10Chart = document.getElementById('pm10Chart').getContext('2d');
    // Currently not in use, date range picker for graphs
   

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
                        unit: 'hour'
                    }
                }]
            }
        },
    })

    // Create the pollution chart 
    var ctx = document.getElementById("pollutionChart").getContext('2d');


    var pollutionGuidelinesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["pm10", "pm2.5"],
            datasets: [
                { label: 'Within guidelines', data: [20, 10], backgroundColor: [safe, safe], borderWidth: 0 },
                { label: '3% Increase In LTM', data: [30, 15], backgroundColor: [light, light,], borderWidth: 0 },
                { label: '9% Increase In LTM', data: [50, 25], backgroundColor: [medium, medium], borderWidth: 0 },
                { label: '15% Increase in LTM', data: [75, 37.5], backgroundColor: [high, high], borderWidth: 0 },
                { label: '1.2% Increase In STM, 15% Increase in LTM', data: [100, 50], backgroundColor: [veryhigh, veryhigh], borderWidth: 0 },
                { label: '2.5% Increase In STM, 15% Increase in LTM', data: [150, 75], backgroundColor: [danger, danger], borderWidth: 0 },
                { label: '5% Increase In STM, 15% Increase in LTM', data: [175, 175], backgroundColor: [bigdanger, bigdanger], borderWidth: 0 }]
        },
        options: {
            title: { display: true, text: "Effects of PM10 and PM2.5 on Long and Short Term Mortality (LTM, STM)" },
            scales: {
                yAxes: [{ ticks: { beginAtZero: true } }],
                xAxes: [{ stacked: true }]
            }
        }
    });
 

    // Creates options for the initial sensor map
    var sensorMap = L.map('mapid', {
        minZoom: 12,
        style: 'mapbox://styles/mapbox/dark-v10',
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    })

    var noPollutionIcon = L.icon({
        iconUrl: 'markers/no_pollution.png',
        iconSize: [50, 50], // size of the icon
        iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -50],// point from which the popup should open relative to the iconAnchor
        altText: "A marker representing no pollution"
    })

    var lightPollutionIcon = L.icon({
        iconUrl: 'markers/light_pollution.png',
        iconSize: [50, 50], // size of the icon
        iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
        altText: "A marker representing light pollution"
    })

    var mediumPollutionIcon = L.icon({
        iconUrl: 'markers/medium_pollution.png',
        iconSize: [50, 50], // size of the icon
        iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
        altText: "A marker representing medium pollution"
    })

    var upperMedPollutionIcon = L.icon({
        iconUrl: 'markers/high_med_pollution.png',
        iconSize: [50, 50], // size of the icon
        iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
        altText: "A marker representing high-to-medium pollution"
    })

    var highPollutionIcon = L.icon({
        iconUrl: 'markers/high_pollution.png',
        iconSize: [50, 50], // size of the icon
        iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
        altText: "A marker representing high pollution"
    })

    var veryHighPollutionIcon = L.icon({
        iconUrl: 'markers/very_high_pollution.png',
        iconSize: [50, 50], // size of the icon
        iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
        altText: "A marker representing very high pollution"
    })

    var maximumPollutionIcon = L.icon({
        iconUrl: 'markers/too_high_pollution.png',
        iconSize: [50, 50], // size of the icon
        iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
        altText: "A marker representing pollution levels that are too high"
    })

    function iconForPollution(pm10, pm2) {
        if (pm10 >= 20 && pm10 < 30 || pm2 >= 10 && pm2 < 15) {
            return lightPollutionIcon
        }
        else if (pm10 >= 30 && pm10 < 50 || pm2 >= 15 && pm2 < 25) {
            return mediumPollutionIcon
        }
        else if (pm10 >= 50 && pm10 < 70 || pm2 >= 25 && pm2 < 35) {
            return upperMedPollutionIcon
        }
        else if (pm10 >= 70 && pm10 < 100 || pm2 >= 35 && pm2 < 50) {
            return highPollutionIcon
        }
        else if (pm10 >= 100 && pm10 < 150 || pm2 >= 50 && pm2 < 75) {
            return veryHighPollutionIcon
        }
        else if (pm10 >= 150 || pm2 >= 75) {
            return maximumPollutionIcon
        }
        else {
            return noPollutionIcon
        }
    }

    if (config.GITHUB_API_TOKEN == "") {
        alert("WARNING: GITHUB_API_TOKEN is not set\nSome carosuel images may not be present")
    }
    if (config.MAP_KEY == "") {
        alert("WARNING: MAP_KEY is not set\nThe mapbox will likely appear as a grey void.")
    }
    if (config.WEATHER_COMPANY_KEY == "") {
        alert("WARNING: WEATHER_COMPANY_KEY is not set\nWeather company infomation will be unavailable.")
    }

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Sensor Data <a href="https://luftdaten.info/en/home-en/">Luftdaten</a> | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: config.MAP_KEY
    }).addTo(sensorMap);

    // Localises the view to go to Sheffield
    sensorMap.setView([53.382, -1.47], 13);
    //var slider = document.getElementById("myRange")
    //var output = document.getElementById("value")

    // Update the current slider value (each time you drag the slider handle)
    //slider.oninput = function () {
    //    current_date = new Date();
    //    current_date.setDate(current_date.getDate() + parseInt(this.value))
    //    output.innerHTML = current_date;
    //}

    // Once slider is released, goes to the date chosen.
    //slider.onmouseup = function () {
    //    chosen_date.setDate(current_date.getDate() + parseInt(this.value))
    //    link = build_link_from_date(current_date, sensor_id)
    //    getData(link)
    //}
    var picker = new Litepicker({
        element: document.getElementById('litepicker'),
        singleMode: false,
        onSelect: function (date1, date2) {
            console.log(date1.getTime(), date2.getTime())
            link = build_link_from_date(date1, sensor_id)
            if (date1.getTime() == date2.getTime()) {
                getData(link)
            } else {
                console.log("Dates not equal so going into big parsing")
                multi_date_search(date1.setDate(date1.getDate()), date2.setDate(date2.getDate() + 1) , sensor_id)
            }
        },
    });
    var currentValidDates = []
    function findDates(id_chosen) {
        days_found = parseInt(document.getElementById("days").value)
        jsonData = { id: id_chosen, days:days_found }
        $body = $("body");

        $.ajax({
            url: '/invaliddates',
            data: JSON.stringify(jsonData),
            contentType: 'application/json',
            type: 'POST',
            success: function (dataR) {
                
                var filteredDates = dataR.filter(function (el) {
                    return el != null;
                })
                console.log(filteredDates)
                picker.setLockDays(filteredDates)

                $('#litepicker').show()
                picker.show()
                
             },
            complete: function (data, res) {
                
            },
            error: function (xhr, status, error) {
                console.log(error.message)
            },
            // shows the loader         
            beforeSend: function () { $body.addClass("loading"); },
            complete: function () { $body.removeClass("loading"); },     
        })
    }
    
    function getData(dateSent, sensorID) {
        jsonData = {date:dateSent, id:sensorID}
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
                $body.removeClass("loading");
            },
            error: function (xhr, status, error) {
                console.log(error.message);
            },
            // shows the loader         
            beforeSend: function () { $body.addClass("loading"); },

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
    function updateGraph(data) {    
        var i;
        label2 = "PM2.5 Values"
        var pm2Data = []
        var pm10Data = []
        var pm2Color = []
        var pm10Color = []
        scatterChartPM10.data.datasets = []
        scatterChartPM2.data.datasets = []

        if (data.length == 0) {
            alert("Sorry, the data wasn't found!")
        } else {
            for (i = 1; i < data.length; i++) {
                date = new Date(data[i]['timestamp'])
                pm2 = { x: date, y: parseFloat(data[i]['P2']) }
                pm10 = { x: date, y: parseFloat(data[i]['P1']) }
                pm2Color.push('green')
                pm10Color.push('red')
                pm2Data.push(pm2)
                pm10Data.push(pm10)
            }
            console.log(scatterChartPM10.data)
            scatterChartPM10.data.datasets.push({ label: "Pm10 Data", data: pm10Data, backgroundColor: 'red' })
            scatterChartPM2.data.datasets.push({ label: "Pm2 Data", data: pm2Data, backgroundColor: 'blue' })
            scatterChartPM10.update()
            scatterChartPM2.update()
        }

    }

    $('#available_dates').click(function () {
        findDates(sensor_id)
    });

    var json = $.getJSON('https://data.sensor.community/static/v2/data.1h.json', function (data) {
        var counter = 0
        var totalpm2 = 0
        var totalpm10 = 0
        console.log("Let's ty this again")
        $.each(data, function (key, val) {
            if ((val.location.longitude > -1.58) && (val.location.longitude < -1.34) && (val.location.latitude <= 53.468) && (val.location.latitude >= 53.29)) {
                console.log("Found one in the correct location")

                if (val.sensordatavalues[0].value_type == "P1") {
                    counter++;
                    totalpm10 += parseFloat(val.sensordatavalues[0].value)
                    totalpm2 += parseFloat(val.sensordatavalues[1].value)
                    items.push([key, val.location.latitude, val.location.longitude, val.sensordatavalues[0].value, val.sensordatavalues[1].value, val.sensor.id, val.sensor.sensor_type.name]);
                }
            }
            
        });


        $('#input[name="dates"]').daterangepicker();

        var circles = []
        for (var i = 0; i < items.length; i++) {
            var pm10 = parseFloat(items[i][3])
            var pm2  = parseFloat(items[i][4])
            var color = colorForPollution(items[i][3], items[i][4])
            var marker = L.circle([items[i][1], items[i][2]], {
                color: 'black',
                fillColor: color,
                fillOpacity: 0.8,
                radius: 100,
                p10: [items[i][3]],
                p2: [items[i][4]],
                sensor_id: [items[i][5]],
                choice_id: i
            })
            var icon_poll = iconForPollution(pm10, pm2)
            var marker = L.marker([items[i][1], items[i][2]], {
                icon: icon_poll,
                p10: pm10,
                p2: pm2,
                sensor_id: [items[i][5]],
                choice_id: i
            })
            circles.push(marker.addTo(sensorMap));

        }

        for (var i = 0; i < circles.length; i++) {
            var colorPM10 = colorForPollution(parseFloat(items[i][3]), 0)
            var colorPM2 = colorForPollution(0, parseFloat(items[i][4]))
            var iconPM10 = '<svg class="bi bi-heart-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="'+colorPM10+'" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" /> </svg>'
            var iconPM2 = '<svg class="bi bi-heart-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="'+colorPM2+'" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" /> </svg>'

            circles[i].bindPopup("<h4><b>Past 24 Hour Average</b></h4><h4>pm10: " + items[i][3] + " " + iconPM10 + "</h4><p>" + colorForPollutionPhrase(parseFloat(items[i][3]), 0) + "</p><h4>pm2.5: " + items[i][4] + " " + iconPM2+ "</h4><p>" + colorForPollutionPhrase(0,parseFloat(items[i][4]))+ "</p><br> <button class='btn btn-primary' type='button' data-toggle='modal' data-target='#exampleModal'>Get Detailed Information And Statistics</button>");
            data_values.push([items[i][0], items[i][1]]);
            circles[i].on('click', function (event) {
                //link = build_link_from_date(chosen_date, sensor_id)
                //getData(link)
                circle_chosen = event.target.options.choice_id
                sensor_id = event.target.options.sensor_id
            })
        }
        
    });
    
});
