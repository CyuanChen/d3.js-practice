//var death_rate = [['Vietnam', 24.26], ['Guam', 10.01], ['Macau', 5.84]];
//var div = d3.select("body").selectAll("div").data(death_rate);
//div_set = div.enter().append("div");
//div_set.text(function(d,i) {
//    return i + "/" + d[0];
//})
//div_set.style("height", "20px");
//div_set.style("background", "red");
//div_set.style("margin", "5px");
//div_set.style("width", function(d, i) {
//    return (d[1] * 10) + "px";
//})
//
//d3.select("body").append("svg").append("rect").attr({
//    x: 10, y: 10, width: 20, height: 20, fill: "red"}).attr({ rx: 3, ry: 3}).transition().attr({
//    x: 20, y: 20, width: 40, height: 10, fill: "blue"
//  });
//d3.select('body').append('svg').append('rect').attrs({x:10, y:10, width: 20, height: 20, fill: "red"}).transition().attrs({x:20, y:20, width:40, height:10, fill: "blue"});
//d3.select("body").selectAll("p").text("Hello world");
//var svg = d3.select("body")
//    .append("svg")
//    .attr("width", 400)
//    .attr("height", 400);
//
//svg.append("circle")
//    .attr("cx", "50px")
//    .attr("cy", "50px")
//    .attr("r", "50px")
//    .attr("fill", "red");

//var data = [0.26, 0, 0.5, 0.8, 0.13, 0.9];
//var result = data
//    .filter(function(d) {
//        return d > 0;
//    })
//    .sort(function(a, b) {
//        return a - b;
//    })
//    .map(function(d, i) {
//        return (d * 100) + '%';
//    });
//
//console.log(result);
//var dataSet = ['蘋果', '香蕉', '芭樂', '西瓜'];
//var p = d3.select("body").selectAll("p");
//p.data(dataSet)
////    .enter()
////    .append("p")
//    .text(function(d,i) {
//    return d + " " + i;
//});
var dataSet = [70,130,120,95,80,170,143];
var width = 400;
var height = 400;
var padding = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
};
var graphicHeight = height - padding.top - padding.bottom;
var rectStep = 35;
var rectWidth = 30;
var maxValue = 200;
var xAxisWidth = width - padding.left - padding.right;
var yAxisWidth = height - padding.top - padding.bottom;
var svg2 = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
function fillRect(target) {
    target.attr("fill", "stellblue")
        .attr("x", function(d, i) {
        return padding.left + i * rectStep
    })
    .attr("y", function(d) {
        return height - padding.bottom - graphicHeight * (d / maxValue);
    })
    .attr("width", rectWidth)
    .attr("height", function(d) {
        return graphicHeight * (d / maxValue);
    });
}

function draw() {
    var updateRect = svg2.selectAll("rect").data(dataSet);
    var enterRect = updateRect.enter();
    var exitRect = updateRect.exit();
    fillRect(updateRect);
    fillRect(enterRect.append("rect"));
    exitRect.remove();
}
var rect = svg2.selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("fill", "steelblue")
    .attr("x", function(d,i) {
        return padding.left + i * rectStep;
    })
    .attr("y", function(d) {
//        return graphicHeight * (d / maxValue);
        return height - padding.bottom - graphicHeight * (d / maxValue);
    })
    .attr("width", rectWidth)
    .attr("height", function(d) {
        return graphicHeight * (d / maxValue);
    });



var text = svg2.selectAll("text")
  .data(dataSet)
  .enter()
  .append("text")
  .attr("fill","white")
  .attr("font-size","14px")
  .attr("text-anchor","middle")
  .attr("x", function(d,i){
      return padding.left + i * rectStep
  })
  .attr("y", function(d){
      //return height - padding.bottom - d
    return height - padding.bottom - graphicHeight * (d / maxValue)
  })
  .attr("dx", rectWidth/2)
  .attr("dy", "1em")
  .text(function(d){
      return d
  });

var svg = d3.select("body").append("svg")
        .attr("width",width)
        .attr("height", height);
var data = [10, 15, 20, 25, 30];
var xScale = d3.scaleLinear()
        .domain([d3.min(data), d3.max(data)])
        .range([0, 300]);
var x_axis = d3.axisBottom()
        .scale(xScale);
svg.append("g").call(x_axis);


var dataSet = [[0.5, 0.5], [0.7,0.8], [0.4,0.9], [0.11,0.32], [0.88,0.25], [0.75,0.12], [0.5,0.1], [0.2,0.3], [0.4,0.1], [0.6,0.7]];

var svg3 = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var svg3xScale = d3.scaleLinear()
    .domain([0, d3.max(dataSet, function(d) {
        return d[0]; // 只要抓x的值
    })])
    .range([0, xAxisWidth]);
var svg3yScale = d3.scaleLinear()
    .domain([d3.max(dataSet, function(d) {
        return d[1];
    }),0])
    .range([0, yAxisWidth]);

var svg3xAxis = d3.axisBottom()
        .scale(svg3xScale);
var svg3yAxis = d3.axisLeft()
        .scale(svg3yScale);
var svg3xAxisG = svg3.append("g")
    .attr("transform", "translate(" + padding.left + "," + (padding.top + yAxisWidth) + ")")
    .call(svg3xAxis);

var svg3yAxisG = svg3.append("g")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .call(svg3yAxis);







