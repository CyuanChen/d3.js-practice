
// set the dimensions and margins of the graph
var margin = {top: 30, right: 40, bottom: 30, left: 40},
    width = parseInt(d3.select(".chartSvg").style('width'), 10) - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y%m");

// set the ranges

var y = d3.scaleLinear().range([height, 0]);
var x2 = d3.scaleTime().range([0, width]);
var y2 = d3.scaleLinear().range([height, 0]);
var x = techan.scale.financetime()
        .range([0, width]);
var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);
var priceDataArr;
var monthEarnDataArr;
var loadType;


var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.4);
var yScale = d3.scaleLinear().rangeRound([height, 0]);

var xAxis = d3.axisBottom()
            .scale(x);
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
var textSvg = d3.select(".textSvg")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// define the line
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".chartSvg")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svgText = textSvg.append("g")
            .attr("class", "description")
            .append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .text("");

var line = d3.line()
        .x(function(d){return x(d.date)})
        .y(function(d) {return yScale(d.price);})

var theData = undefined;
//loadJSON("earn1102.json", "price1102.json");
loadJSON("https://cors-anywhere.herokuapp.com/https://gist.githubusercontent.com/CyuanChen/95b04feecc4fb6eed498643d04c89103/raw/087daf9ec80f91ceeae25a1bff09dda69096f019/1301DataEarn.json", "https://cors-anywhere.herokuapp.com/https://gist.githubusercontent.com/CyuanChen/293d826cf840f8afbd98e40a3b93d55a/raw/c5b63faac6d9fa61c8b2df6fda3c2f7df2093a81/1301DataPrice.json");
window.addEventListener('resize', resize );


function draw(data, origindata) {
    data = data.reverse();
    priceDataArr = data;
    x.domain(origindata.map(candlestick.accessor().d));
//    xScale.domain(d3.extent(data, function(d) { 
//    return d.date; }));
    xScale.domain(data.map(function(d){return d.date;}));
    
    var maxData = d3.max(data, function(d){return d.price}) / 10;
    yScale.domain([d3.min(data, function(d){return d.price - maxData;}), d3.max(data, function(d){ return d.price + maxData;})])

    y.domain([d3.min(data, function(d){return d.price - maxData;}), d3.max(data, function(d){ return d.price + maxData;})])

    console.log(data);
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", line);
    
    svg.append("g")
        .attr("class", "y axisLeft")
        .call(yAxis.ticks(5));
    
    svg.append("g")
        .append("text")
        .attr("x", 20)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text("Price (TWD)");
   
    svg.append("g")
        .attr("class", "crosshair")
        .call(crosshair)
  }
    
function drawBar(data, priceData) {
    svg.selectAll("*").remove();
    monthEarnDataArr = data;
    data.reverse();
    x.domain(priceData.map(candlestick.accessor().d));
    x2.domain(d3.extent(data, function(d) { 
    return d.date; }));
    var minData = d3.min(data, function(d){return d.earn}) / 10;
//    console.log(minData)
    
    y2.domain([d3.min(data, function(d) {return d.earn - minData;}), d3.max(data, function(d) {return d.earn + minData;})]);
//    y2.domain(d3.extent(data, function(d) {return d.price;}))
    xScale.domain(data.map(function(d){return d.date;}));
    
    
    var chart = svg.selectAll("bar")
        .data(data)
        .enter().append("g");
    chart.append("rect")
        .attr("class", "bar")
        .attr("x", function(d){return x(d.date) - xScale.bandwidth() / 2;})
        .attr("height", function(d){return height - y2(d.earn);})
        .attr("y", function(d){return y2(d.earn);})
        .attr("width", xScale.bandwidth());
    
      // Add the X Axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")      
        
        .call(d3.axisBottom(x).ticks(width / 50).tickFormat(d3.timeFormat("%Y%m")).tickSize(-height, -height));    
    
    // Add the Y2 Axis
    svg.append("g")
        .attr("class", "y axisRight")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y2).ticks(5).tickSize(-width, -width));
    svg.append("g")
        .attr("transform", "translate(" + (width + 40) + ",0)")
        .attr("class", "y axisText")
        .append("text")
        
        .attr("y", -10)
        .style("text-anchor", "end")
        .text("(百萬元)");
}

// 畫月營收年增率Bar條
function drawBar2(data, priceData) {
    data.reverse();
    monthEarnDataArr = data;
//    console.log(data);
    x2.domain(d3.extent(data, function(d) { 
    return d.date; }));
    // 
    y2.domain([-50, 75]);
//    y2.domain(d3.extent(data, function(d){ return d.revenue;})).nice();
    x.domain(priceData.map(candlestick.accessor().d));
    xScale.domain(data.map(function(d){return d.date;}));
    
    svg.append("g")
        .attr("class", "x axisZero")
        .append("line")
        .attr("y1", y2(0))
        .attr("y2", y2(0))
        .attr("x2", width);
      // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(width / 50).tickFormat(d3.timeFormat("%Y%m")).tickSize(-height, -height));
    
    
    // Add the Y2 Axis
    svg.append("g")
        .attr("class", "y axisRight")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y2).ticks(5).tickSize(-width, -width));
    
    
    svg.append("g")
        .attr("transform", "translate(" + (width + 40) + ",0)")
        .attr("class", "y axisText")
        .append("text")
        
        .attr("y", -10)
        .style("text-anchor", "end")
        .text("(%)");
    
    var chart = svg.selectAll("bar")
        .data(data)
        .enter().append("g");
    
    chart.append("rect")
        .attr("class", "bar")
        .attr("x", function(d){return x(d.date) - xScale.bandwidth() / 2;})
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
   

function resize() {
    width = parseInt(d3.select(".chartSvg").style('width'), 10);
    width = width - margin.left - margin.right;
//    d3.select(".textSvg").attr("width", width)

//    console.log("Resize width :" + width);
    // K線圖的x
    x.range([0, width]);
    // K線圖的y
    y.range([height - 60, 0]);
    //成交量的x
    xScale.range([0, width]);

    svg.select("g.y.axisText")
        .attr("transform", "translate(" + (width + 20) + ",0)");
    svg.selectAll(".bar")
        .attr("x", function(d){return x(d.date) - xScale.bandwidth() / 2;})
        .attr("width", (xScale.bandwidth()));
    svg.select("g.crosshair").attr("width", width).call(crosshair);
    
//    svg.select("g.candlestick").call(candlestick);
      svg.selectAll(".line")
        .attr("d", line);
    
//      svg.select("g.x.axis").call(xAxis);
    svg.select("g.x.axis").call(xAxis.ticks(width / 70).tickFormat(d3.timeFormat("%Y%m")));
    svg.select("g.y.axisRight")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y2).ticks(5).tickSize(-width, -width));
    
}



function loadJSON(earnData, priceData) {
    svg.selectAll("*").remove();  
    loadType = "monthRate";
    d3.json(earnData ,function(error, data) {
        if (error) throw error;
        console.log(data);
        var jsonData = data["Data"];
        
        var newEarnData = jsonData.map(function(d) {
            return {
                date: parseTime(d[0]),
                earn: +(Math.round(d[5]/ 1000))
            };
        });
        console.log(jsonData);
        console.log(newEarnData);

        d3.json(priceData , function(error, priceData) {
            var jsonData = priceData["Data"];

            var newData = jsonData.map(function(d) {
                return {
                    date: parseTime(d[0]),
                    price: +d[6]
                };
            });
            jsonData = jsonData.reverse();

            jsonData = jsonData.map(function(d) {
            return {
                date: parseTime(d[0]),
                open: +d[3],
                high: +d[4],
                low: +d[5],
                close: +d[6],
                volume: +d[10]
                }                          
            })
    //        monthEarnDataArr = newData;
    //    console.log(newData);
    //    drawBar(newData);
            drawBar(newEarnData, jsonData);
            draw(newData, jsonData);

        }) 
    });

  
   
    

}
    
function loadRateJSON(earnData, priceData) {
    svg.selectAll("*").remove();
    loadType = "yearRate";
   d3.json(earnData ,function(error, data) {
    if (error) throw error;
    var jsonData = data["Data"];
    var newEarnData = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            earn: +d[5],
            revenue: +d[7]
        };
    });

    d3.json(priceData , function(error, priceData) {
//        console.log(data);
        var jsonData = priceData["Data"];
//    console.log(jsonData);
        
        var newData = jsonData.map(function(d) {
            return {
                date: parseTime(d[0]),
                price: +d[6]
            };
        });
        jsonData = jsonData.reverse();
    
        jsonData = jsonData.map(function(d) {
        return {
            date: parseTime(d[0]),
            open: +d[3],
            high: +d[4],
            low: +d[5],
            close: +d[6],
            volume: +d[10]
            }                          
        })
//    console.log(newData);
//    drawBar(newData);
//        drawBar2(newData2, jsonData);
         drawBar2(newEarnData, jsonData);
        draw(newData, jsonData);
    
        }) 
    }); 
    

}
    
 function move(coords, index) {    
    var i;
    console.log()
        for (i = 0; i < monthEarnDataArr.length; i ++) {
            if ((d3.timeFormat("%Y/%m/%d")(coords.x) === d3.timeFormat("%Y/%m/%d")(priceDataArr[i].date))) {
//                console.log(coords.y);
                if (loadType == "monthRate") {
                    svgText.text(d3.timeFormat("%Y/%m")(coords.x) + " 股價：" + priceDataArr[i].price + " 月營收：" + monthEarnDataArr[i].earn + " (百萬)"); 
                } else {
                    svgText.text(d3.timeFormat("%Y/%m")(coords.x) + " 股價：" + priceDataArr[i].price + " 月營收年增率：" + monthEarnDataArr[i].revenue + "(%)"); 
                }
            }
        }
}   


    