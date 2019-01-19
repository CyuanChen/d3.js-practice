var rand = d3.randomNormal(170,15);
var dataSet = [];
for (var i = 0; i< 100; i++) {
    dataSet.push(rand());
}

var width = 500;
var height = 380;
var padding = {top: 30, right: 30, bottom: 30, left: 30};

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var binNum = 10, rangeMin = 130, rangeMax = 210;
var histogram = d3.histogram()
    .value([rangeMin, rangeMax])
//    .bins(binNum);
//    .frequency(true);
var hisData = histogram(dataSet);

var xAxisWidth = width - padding.left - padding.right;
var yAxisWidth = 450;
var xTicks = hisData.map(function(d) {return d.x;})
//var xScale = d3.scale().ordinal()



