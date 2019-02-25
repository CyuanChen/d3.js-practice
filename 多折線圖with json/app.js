
// set the dimensions and margins of the graph
var margin = {top: 20, right: 100, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y%m");

// set the ranges
var x = d3.scaleTime().range([0, width]);
//var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
//    x.ticks(19);
var y = d3.scaleLinear().range([height, 0]);
var x2 = d3.scaleTime().range([0, width]);
var y2 = d3.scaleLinear().range([height, 0]);
  
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.4);
var yScale = d3.scaleLinear().rangeRound([height, 0]);
  
// define the line
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var theData = undefined;
//    loadRateJSON();
loadJSON();


function draw(data) {
    theData = data;
    data = data.reverse();
    console.log(data);
//    xScale.domain(d3.extent(data, function(d) { 
//    return d.date; }));
    
    yScale.domain([d3.min(data, function(d){return d.price - 5;}), d3.max(data, function(d){ return d.price + 5;})])
//    yScale.domain([0, d3.max(data, function(d) {
//	  return d.price; })]);
    x.domain(d3.extent(data, function(d) { 
    return d.date; }));
    y.domain([0, d3.max(data, function(d) {
	  return d.price; })]);

    var line = d3.line()
    .x(function(d) {return xScale(d.date) + xScale.bandwidth() / 2;})
    .y(function(d) {return yScale(d.price);})
    
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
//        .attr("transform", "translate(" + (xScale.bandwidth() / 2) + ",0)")
        .attr("d", line);
    


  // Add the Y Axis
  svg.append("g")
        .call(d3.axisLeft(yScale).ticks(5));
  }
    
function drawBar(data) {
    svg.selectAll("*").remove();
    data.reverse();
    x2.domain(d3.extent(data, function(d) { 
    return d.date; }));
    y2.domain([d3.min(data, function(d) {return d.earn -500000;}), d3.max(data, function(d) {return d.earn + 500000;})]);
//    y2.domain(d3.extent(data, function(d) {return d.price;}))
    console.log(data);
    xScale.domain(data.map(function(d){return d.date;}));
    yScale.domain([d3.min(data, function(d) {return d.earn -5;}), d3.max(data, function(d) {return d.earn + 5;})]);
    
    var chart = svg.selectAll("bar")
        .data(data)
        .enter().append("g");
    chart.append("rect")
        .attr("class", "bar")
        .attr("x", function(d){return xScale(d.date);})
        .attr("height", function(d){return height - y2(d.earn);})
        .attr("y", function(d){return y2(d.earn);})
        .attr("width", xScale.bandwidth());
    
      // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(20).tickFormat(d3.timeFormat("%Y%m")).tickSize(-height, -height));
    
    // Add the Y2 Axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y2).ticks(5).tickSize(-width, -width));
    
}

function drawBar2(data) {
    data.reverse();
    console.log(data);
    console.log(d3.extent(data, function(d){return d.revenue}))
    console.log(d3.max(data, function(d) {return d.revenue}))
    x2.domain(d3.extent(data, function(d) { 
    return d.date; }));
    y2.domain([-50, 75]);
//    y2.domain(d3.extent(data, function(d){ return d.revenue;})).nice();
    console.log(data.map(function(d) {return d.revenue}));
//    console.log(data);
    xScale.domain(data.map(function(d){return d.date;}));
    
     svg.append("g")
        .attr("class", "x axis")
        .append("line")
        .attr("y1", y2(0))
        .attr("y2", y2(0))
        .attr("x2", width);
      // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(20).tickFormat(d3.timeFormat("%Y%m")).tickSize(-height, -height));
    
    
    // Add the Y2 Axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y2).ticks(5).tickSize(-width, -width));

    var chart = svg.selectAll("bar")
        .data(data)
        .enter().append("g");
    
    chart.append("rect")
        .attr("class", "bar")
        .attr("x", function(d){return xScale(d.date);})
        .attr("height", function(d){return Math.abs(y2(d.revenue) - y2(0));})
        .attr("y", function(d){
            if (d.revenue > 0) {
                return y2(d.revenue);
            } else {
                return y2(0);
            }
        })
        .attr("width", xScale.bandwidth());

}
   
// Get the data
var monthEarn = {date: [], earn: []};
var stock = {date:[], price: [], earn: []};
var mapDate = [];




function loadJSON() {
    svg.selectAll("*").remove();  
    d3.json("data.json",function(error, data) {
    
    if (error) throw error;
    var jsonData = data["Data"];
    
    console.log(jsonData);
    var newData = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            earn: +d[5]
        };
    });
    console.log(newData);
    // trigger render
//    draw(newData);
    drawBar(newData);
    });
    
    d3.json("stock.json", function(error, data) {
    var jsonData = data["Data"];
    console.log(jsonData);
        
    var newData = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            price: +d[6]
        };
    });
    console.log(newData);
//    drawBar(newData);
        draw(newData);
    
}) 
    

}
    
function loadRateJSON() {
    svg.selectAll("*").remove();
    d3.json("data.json",function(error, data) {
  if (error) throw error;
    var jsonData = data["Data"];
    
    console.log(jsonData);
    var newData = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            earn: +d[5]
        };
    });
    var newData2 = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            revenue: +d[7]
        }
    })
    drawBar2(newData2);
    console.log(newData);
    // trigger render
//    draw(newData);
   
});
     d3.json("stock.json", function(error, data) {
    var jsonData = data["Data"];
    console.log(jsonData);
        
    var newData = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            price: +d[6]
        };
    });
    console.log(newData);
//    drawBar(newData);
    draw(newData);
    
})  
    
    

}
    
    

    
    
    

//var originJson = undefined;
//d3.json("origin.json", function(error, data) {
//    originJson = data;
////    draw(data, "Afghanistan")
//})

    