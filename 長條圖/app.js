
var margin = {top: 10, right:30, bottom: 30, left: 40};
//    width = 960 - margin.left - margin.right,
//    width = parseInt(d3.select(".content").style("width"), 10) - margin.left - margin.right,
//    height = parseInt(d3.select(".content").style("width"), 10) - margin.left - margin.right;
//    height = 500 - margin.top - margin.bottom;
var parseDate = d3.timeParse("%d-%m-%Y");
//var parseDate = d3.timeParse("%m/%d/%Y %H:%M:%S %p");

var svg = d3.select("svg");
var x = d3.scaleTime()
        .domain([new Date(2010, 6, 3), new Date(2012, 1, 1)]);
var y = d3.scaleLinear();
var theData = undefined;
var g = svg.append("g");

  // add the x Axis
  g.append("g")
        .attr("class", "axis--x");

  // add the y Axis
  g.append("g")
        .attr("class", "axis--y");
  var bounds = svg.node().getBoundingClientRect();
    var width = bounds.width - margin.left - margin.right,
    height = bounds.height - margin.left - margin.right;    
   

function draw() {
    
    
    x.rangeRound([0, width]);
    y.range([height, 0]);

var histogram = d3.histogram()
    .value(function(d) { return d.date;})
    .domain(x.domain())
    .thresholds(x.ticks(d3.timeMonth));

    svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
    // group the data for the bars
  var bins = histogram(theData);
    // Scale the range of the data in the y domain
  y.domain([0, d3.max(bins, function(d) { return d.length; })]);
    
    // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function(d) {
		  return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
      .attr("width", function(d) { return x(d.x1) - x(d.x0) - 1 ; })
      .attr("height", function(d) { return height - y(d.length); });

    g.select(".axis--x")
        .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    g.select(".axis--y").call(d3.axisLeft(y));
    


}


function loadData() {
    // get the data
d3.csv("earthquakes.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.date = parseDate(d.dtg);
  });

  theData = data;

  
    draw();
     
});
}


d3.select(window).on('resize', draw);
loadData();


















