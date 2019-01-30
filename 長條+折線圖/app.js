var dataFile = "data.csv",
    xName = "year",
    xAxis = { "label": "Years", "x": -60, "y": 80},
    yName = "value1",
    y2Name = "value2",
    yAxisLabel = "Values",
    barColor = "#3366cc",
    lineColor = "#16a085",
    plotTitle = { "name": "Template for a bar+line chart", "x": 350, "y": 25},
    plotLegend = { "pos": {"x": -400, "y": 60},
                 "data": [{"name": yName, "color": barColor},
                 {"name": y2Name, "color": lineColor}]};

function transformXdata(data) {
  return data;
}
function transformYdata(data) {
  return +data;
}
// **************************

// Define the svg element, the plot dimensions (and margins)
var svg = d3.select("svg"),
    margin = {top: 50, right: 20, bottom: 50, left: 30},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
var width2 = svg.attr("width") - margin.left - margin.right;

console.log(width);
console.log(width2);

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

// Define the svg subelements 'g'
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(dataFile, function(d) {
  return {xData: transformXdata(d[xName]),
    			yData: transformYdata(d[yName]),
          y2Data: transformYdata(d[y2Name])}; // '+' converts to numbers
}, function(error, data) {
  if (error) throw error;

  // Define the span of x and y axis
  var maxY= Math.max(d3.max(data, function(d) { return d.yData; }), d3.max(data, function(d) { return d.y2Data; }));
  x.domain(data.map(function(d) { return d.xData; }));
  y.domain([0, maxY]);
  
  var line = d3.line()
   .x(function(d) { return x(d.xData); })
   .y(function(d) { return y(d.y2Data); });

  // Add the x-axis
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
	svg.append("text") // Add x-axis label
      .attr("fill", "#000")
  		.attr("x", (width /2) + xAxis.x)
  		.attr("y", height + xAxis.y)
  		.style("font-size", "14px")
  		.text(xAxis.label);

  // Add the y-axis
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em");
	svg.append("text") // Add y-axis label
  	  .attr("fill", "#000")
  		.attr("x", 0)
  		.attr("y", maxY)
  		.style("font-size", "14px")
  		.text(yAxisLabel);

  // Add one bars (y)
  var widthBar = x.bandwidth();
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
  		.attr("fill", barColor)
      .attr("x", function(d) { return x(d.xData); })
      .attr("y", function(d) { return y(d.yData); })
      .attr("width", widthBar)
      .attr("height", function(d) { return height - y(d.yData); });
  
  // Add line (y2)
  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
  		.attr("transform", "translate(" + widthBar / 2 + ",0)")
      .attr("stroke-width", 2.5)
      .attr("d", line);
  
	// Add a title	  
	svg.append("svg:text")
  		.style("font-size", "18px")
		 	.attr("class", "title")
	   	.attr("x", plotTitle.x)
	   	.attr("y", plotTitle.y)
	   	.text(plotTitle.name);
  
  // Add a legend
  var legend = svg.append("g")
	  .attr("class", "legend")
	  .attr("height", 100)
	  .attr("width", 100)
    .attr("transform", "translate(" + plotLegend.pos.x + "," + plotLegend.pos.y + ")");
  var plotData = plotLegend.data;
  legend.selectAll("rect")
      .data(plotData)
      .enter()
      .append("rect")
	  	.attr("x", width - 65)
    	.attr("y", function(d, i){ return i *  20;})
	  	.attr("width", 10)
	  	.attr("height", 10)
	  	.style("fill", function(d) { 
        return d.color;
      });
      
    legend.selectAll("text")
      .data(plotData)
      .enter()
      .append("text")
    	.attr("fill", "#000")
	  	.attr("x", width - 52)
    	.attr("y", function(d, i){ return i *  20 + 9;})
	  	.text(function(d) {
        return d.name;
      });
  
});