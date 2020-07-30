// Define colours for gauge segments
var colours = {
    "#6699cc": {
      min: 0,
      max: 50,
    },
    "#fff275": {
      min: 51,
      max: 100,
    },
    "#ff8441": {
      min: 101,
      max: 150,
    },
    "#ff3c38": {
      min: 151,
      max: 200,
    },
    "#d600a4": {
      min: 201,
      max: 300,
    },
    "#a20049": {
      min: 301,
      max: 500,
    },
};
  
export default function (container, configuration) {
var that = {};
// Configure initial gauge settings
var config = {
    size: 200,
    clipWidth: 200,
    clipHeight: 110,
    ringInset: 20,
    ringWidth: 20,

    pointerWidth: 10,
    pointerTailLength: 5,
    pointerHeadLengthPercent: 0.9,

    minValue: 0,
    maxValue: 500,

    minAngle: -90,
    maxAngle: 90,

    transitionMs: 750,

    majorTicks: 10,
    labelFormat: d3.format(",g"),
    labelInset: 10,
};
var range = undefined;
var r = undefined;
var pointerHeadLength = undefined;

var svg = undefined;
var arc = undefined;
var scale = undefined;
var ticks = undefined;
var tickData = undefined;
var pointer = undefined;

function deg2rad(deg) {
    return (deg * Math.PI) / 180;
}

function configure(configuration) {
    var prop = undefined;
    for (prop in configuration) {
        config[prop] = configuration[prop];
    }

    range = config.maxAngle - config.minAngle;
    r = config.size / 2;
    pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

    // a linear scale that maps domain values to a percent from 0..1
    scale = d3.scale
    .linear()
    .range([0, 1])
    .domain([config.minValue, config.maxValue]);

    ticks = scale.ticks(config.majorTicks);
    tickData = d3.range(config.majorTicks).map(function () {
        return 1 / config.majorTicks;
    });

    arc = d3.svg
    .arc()
    .innerRadius(r - config.ringWidth - config.ringInset)
    .outerRadius(r - config.ringInset)
    .startAngle(function (d, i) {
        var ratio = d * i;
        return deg2rad(config.minAngle + ratio * range);
    })
    .endAngle(function (d, i) {
        var ratio = d * (i + 1);
        return deg2rad(config.minAngle + ratio * range);
    });
}
that.configure = configure;

function centerTranslation() {
    return "translate(" + r + "," + r + ")";
}

// Check if gauge is rendered
function isRendered() {
    return svg !== undefined;
}
that.isRendered = isRendered;

// Render gauge with values from constructor
function render(newValue) {
    svg = d3
    .select(container)
    .append("svg:svg")
    .attr("class", "gauge")
    .attr("width", config.clipWidth)
    .attr("height", config.clipHeight);

    var centerTx = centerTranslation();

    var arcs = svg
    .append("g")
    .attr("class", "arc")
    .attr("transform", centerTx);

    arcs
    .selectAll("path")
    .data(tickData)
    .enter()
    .append("path")
    .attr("fill", function (d, i) { 
        var threshold = i * 50 + 1;
        var col = "";
        // Set correct colour for each segment
        Object.keys(colours).forEach((colour) => {
        if (
            threshold >= colours[colour].min &&
            threshold <= colours[colour].max
        ) {
            col = colour;
        }
        });
        return col;
    })
    .attr("d", arc);

    var lg = svg
    .append("g")
    .attr("class", "label")
    .attr("transform", centerTx);
    lg.selectAll("text")
    .data(ticks)
    .enter()
    .append("text")
    .attr("transform", function (d) {
        var ratio = scale(d);
        var newAngle = config.minAngle + ratio * range;
        return (
            "rotate(" +
            newAngle +
            ") translate(0," +
            (config.labelInset - r) +
            ")"
        );
    })
    .text(config.labelFormat);

    var lineData = [
    [config.pointerWidth / 2, 0],
    [0, -pointerHeadLength],
    [-(config.pointerWidth / 2), 0],
    [0, config.pointerTailLength],
    [config.pointerWidth / 2, 0],
    ];
    var pointerLine = d3.svg.line().interpolate("monotone");
    var pg = svg
    .append("g")
    .data([lineData])
    .attr("class", "pointer")
    .attr("transform", centerTx);

    pointer = pg
    .append("path")
    .attr(
        "d",
        pointerLine
    )
    .attr("transform", "rotate(" + config.minAngle + ")");

    update(newValue === undefined ? 0 : newValue);
}
that.render = render;

// Update gauge values
function update(newValue, newConfiguration) {
    if (newConfiguration !== undefined) {
    configure(newConfiguration);
    }
    var ratio = scale(newValue);
    var newAngle = config.minAngle + ratio * range;
    pointer
    .transition()
    .duration(config.transitionMs)
    .ease("elastic")
    .attr("transform", "rotate(" + newAngle + ")");
}
that.update = update;

configure(configuration);

return that;
};