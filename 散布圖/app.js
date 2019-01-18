var dataSet = [[0.5, 0.5], [0.7,0.8], [0.4,0.9], [0.11,0.32], [0.88,0.25], [0.75,0.12], [0.5,0.1], [0.2,0.3], [0.4,0.1], [0.6,0.7]];
var width = 400;
var height = 400;
var padding = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
};
var graphicHeight = height - padding.top - padding.bottom;
var xAxisWidth = width - padding.left - padding.right;
var yAxisWidth = height - padding.top - padding.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", "400")
    .attr("height", "400");






var xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, xAxisWidth]);
var yScale = d3.scaleLinear()
    .domain([1, 0])
    .range([0, yAxisWidth]);

var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5)
    .tickFormat(function(d) {
        return d * 100 + '%';
    })
    .tickSize(-yAxisWidth, -yAxisWidth);

var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5)
    .tickFormat(function(d) {
        return d * 100 + '%'
    })
    .tickSize(-xAxisWidth, -xAxisWidth);

var xAxisG = svg.append('g')
    .attr("transform", "translate(" + padding.left + "," + (padding.top + yAxisWidth) + ")")
    .classed("xAxis", true)
    .call(xAxis);
var yAxisG = svg.append('g')
  .attr("transform","translate("+padding.left+","+padding.top+")")
  .classed("yAxis",true)
  .call(yAxis)

function fillCircle(el) {
    el.attr("fill", "black")
    .attr("cx", function(d) {
        return padding.left + xScale(d[0]);
    })
    .attr("cy", function(d) {
        return padding.top + yScale(d[1]);
    })
    .attr("r", 5);
}


function getData() {
    dataSet = [];
    var rand = d3.randomNormal(50,15);
    for (var i = 0; i < 10; i++) {
        var valueX = (rand()/100).toFixed(1);
        var valueY = (rand()/100).toFixed(1);
        dataSet.push([valueX, valueY]);
    }
    draw();
}
function draw() {
    var update = svg.selectAll("circle")
        .data(dataSet);
    var enter = update.enter();
    var exit = update.exit();
//    update.call(fillCircle);
//    enter.append("circle").call(fillCircle);
//    exit.remove();
      update
  	.transition()
    .duration(300)
  	.call(fillCircle)
  enter
  	.append("circle")
    .attr("fill","black")
    .attr("cx",padding.left)
    .attr("cy",height - padding.bottom)
    .attr("r",5)
  	.transition()
    .duration(500)
    .call(fillCircle)
  exit.remove()
    
}
//var circle = svg.selectAll("circle")
//    .data(dataSet)
//    .enter()
//    .append("circle")
//    .attr("fill", "black")
//    .attr("cx", function(d) {
//        return padding.left + xScale(d[0]);
//    })
//    .attr("cy", function(d) {
//        return padding.top + yScale(d[1]);
//    })
//    .attr("r", 5);



























