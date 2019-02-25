
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
var x3 = techan.scale.financetime()
        .range([0, width]);
var candlestick = techan.plot.candlestick()
        .xScale(x3)
        .yScale(y);




var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.4);
var yScale = d3.scaleLinear().rangeRound([height, 0]);

var xAxis = d3.axisBottom()
            .scale(x3);
var yAxis = d3.axisLeft()
            .scale(y);

var ohlcAnnotation = techan.plot.axisannotation()
        .axis(xAxis)
        .orient('left')
        .format(d3.format(',.2f'));

var timeAnnotation = techan.plot.axisannotation()
        .axis(yAxis)
        .orient('bottom')
        .format(d3.timeFormat('%Y%m'))
        .width(20)
        .translate([0, height]);

var crosshair = techan.plot.crosshair()
        .xScale(x)
        .yScale(y)
//        .xAnnotation(timeAnnotation)
//        .yAnnotation(ohlcAnnotation)
        .on("move", move);


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


function draw(data, origindata) {
    var accessor = candlestick.accessor();
    
    data = data.reverse();
    origindata = origindata.reverse();
    
    origindata = origindata.map(function(d) {
        return {
            date: parseTime(d[0]),
            open: +d[3],
            high: +d[4],
            low: +d[5],
            close: +d[6],
            volume: +d[10]
      }                          
  })
//    console.log(origindata);
    x3.domain(origindata.map(accessor.d));
//    xScale.domain(d3.extent(data, function(d) { 
//    return d.date; }));
    xScale.domain(data.map(function(d){return d.date;}));
    yScale.domain([d3.min(data, function(d){return d.price - 5;}), d3.max(data, function(d){ return d.price + 5;})])
    x.domain(d3.extent(data, function(d) { 
    return d.date; }));
    y.domain([d3.min(data, function(d){return d.price - 5;}), d3.max(data, function(d){ return d.price + 5;})])
//    y.domain([0, d3.max(data, function(d) {return d.price; })]);

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
    

  
    svg.append("g")
    .call(yAxis.ticks(5));
//        .call(d3.axisLeft(yScale).ticks(5));
   
    svg.append("g")
        .attr("class", "crosshair")
        .call(crosshair)
  }
    
function drawBar(data) {
    svg.selectAll("*").remove();
    data.reverse();
    x.domain(d3.extent(data, function(d) { 
    return d.date; }));
    x2.domain(d3.extent(data, function(d) { 
    return d.date; }));
    y2.domain([d3.min(data, function(d) {return d.earn -500000;}), d3.max(data, function(d) {return d.earn + 500000;})]);
//    y2.domain(d3.extent(data, function(d) {return d.price;}))
//    console.log(data);
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
//        .call(xAxis.ticks(20).tickFormat(d3.timeFormat("%Y%m")).tickSize(-height, -height));
    
        .call(d3.axisBottom(xScale).ticks(20).tickFormat(d3.timeFormat("%Y%m")).tickSize(-height, -height));    
    
    // Add the Y2 Axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y2).ticks(5).tickSize(-width, -width));
    
}

function drawBar2(data) {
    data.reverse();
//    console.log(data);
    x2.domain(d3.extent(data, function(d) { 
    return d.date; }));
    y2.domain([-50, 75]);
//    y2.domain(d3.extent(data, function(d){ return d.revenue;})).nice();
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
    
//    console.log(jsonData);
    var newData = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            earn: +d[5]
        };
    });
//    console.log(newData);
    // trigger render
//    draw(newData);
    drawBar(newData);
    });
    
    d3.json("stock.json", function(error, data) {
    var jsonData = data["Data"];
//    console.log(jsonData);
        
    var newData = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            price: +d[6]
        };
    });
//    console.log(newData);
//    drawBar(newData);
    draw(newData, jsonData);
    
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
//    console.log(jsonData);
        
    var newData = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            price: +d[6]
        };
    });
//    console.log(newData);
//    drawBar(newData);
    draw(newData, jsonData);
    
})  
    
    

}
    
 function move(coords, index) {
//    console.log(coords.x + "," + coords.y)
    
    var i;
//    for (i = 0; i < dataArr.length; i ++) {
//        if (coords.x === dataArr[i].date) {
//            svgText.text(d3.timeFormat("%Y/%m/%d")(coords.x) + ", 開盤：" + dataArr[i].open + ", 高：" + dataArr[i].high + ", 低："+ dataArr[i].low + ", 收盤："+ dataArr[i].close + ", 漲跌：" + dataArr[i].change + ", 成交量：" + dataArr[i].volume); 
//                         + "(" + dataArr[i].percentChange + "%)" + ", 成交量： " + dataArr[i].volume + ", 5MA: " + dataArr[i].fiveMA + ", 20MA: " + dataArr[i].twentyMA + ", 60MA: " + dataArr[i].sixtyMA );
//        }
//    }
}   


    