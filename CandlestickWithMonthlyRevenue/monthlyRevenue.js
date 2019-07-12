

// set the dimensions and monthlyRevenueMargins of the graph
var monthlyRevenueMargin = {top: 30, right: 80, bottom: 30, left: 80},
   width = parseInt(d3.select("#monthlyRevenue").style('width'), 10) - monthlyRevenueMargin.left - monthlyRevenueMargin.right,
   height = 500 - monthlyRevenueMargin.top - monthlyRevenueMargin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y%m");

// set the ranges

var y = d3.scaleLinear().range([height, 0]);
var x2 = d3.scaleTime().range([0, width]);
var y2 = d3.scaleLinear().range([height, 0]);
var x = techan.scale.financetime()
       .range([0, width]);
var candlestickMonthly = techan.plot.candlestick()
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
       .on("move", monthlyMove);


var monthlyRevenueDiv = d3.select("#monthlyRevenue")
        .append("div")
        .attr("transform", "translate(" + 10 + "," + monthlyRevenueMargin.top + ")");
var monthlyRevenueDate = monthlyRevenueDiv.append("div")
    .attr("id", "monthlyRevenueDate")
    .append("i").text("2019/05/14")

var stock = monthlyRevenueDiv.append("div")
    .attr("id", "stock")
    .append("p").text("股價：")
var stockValue = monthlyRevenueDiv.select("#stock")
    .append("u")
var monthlyRevenueText = monthlyRevenueDiv.append("div")
    .attr("id", "monthlyRevenueText")
    .append("p").text("月營收：")
var monthlyRevenueTextValue = monthlyRevenueDiv.select("#monthlyRevenueText")
    .append("u")

// define the line
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left monthlyRevenueMargin

var svg = d3.select("#monthlyRevenue")
        .append("svg")
        .attr("class", "monthlyChartSvg")
        .attr("width", width + monthlyRevenueMargin.left + monthlyRevenueMargin.right)
        .attr("height", 500)
        .append("g")
        .attr("transform",
         "translate(" + monthlyRevenueMargin.left + "," + monthlyRevenueMargin.top + ")");



// var svgText = textSvg.append("g")
//            .attr("class", "monthText")
//            .append("text")
//            .attr("y", 6)
//            .attr("dy", ".71em")
//            .style("text-anchor", "start")
//            .text("");
// var svgText2 = textSvg.append("g")
//            .attr("class", "monthText2")
//            .attr("transform", "translate(0,25)")
//            .append("text")
//            .attr("y", 6)
//            .attr("dy", ".71em")
//            .style("text-anchor", "start")
//            .text("");
var line = d3.line()
        .x(function(d){return x(d.date)})
        .y(function(d) {return yScale(d.price);})

var theData = undefined;
loadJSON("https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/CyuanChen/d3.js-practice/master/%E5%A4%9A%E6%8A%98%E7%B7%9A%E5%9C%96with%20json/earn1102.json", "https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/CyuanChen/d3.js-practice/master/%E5%A4%9A%E6%8A%98%E7%B7%9A%E5%9C%96with%20json/price1102.json");

window.addEventListener('resize', monthRevenueResize );


function draw(data, origindata) {
   data = data.reverse();
   priceDataArr = data;
   x.domain(origindata.map(candlestickMonthly.accessor().d));
//    xScale.domain(d3.extent(data, function(d) { 
//    return d.date; }));
   xScale.domain(data.map(function(d){return d.date;}));
   
   var maxData = d3.max(data, function(d){return d.price}) / 10;
   yScale.domain([d3.min(data, function(d){return d.price - maxData;}), d3.max(data, function(d){ return d.price + maxData;})])

//    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
   y.domain([d3.min(data, function(d){return d.price - maxData;}), d3.max(data, function(d){ return d.price + maxData;})])

   var line = d3.line()
       .x(function(d){return x(d.date)})
   .y(function(d) {return yScale(d.price);})
//    console.log(data);
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
   
   svg.append("g")
       .append("text")
       .attr("x", 30)
       .attr("y", -10)
       .style("text-anchor", "end")
       .text("Price (TWD)");
  
   svg.append("g")
       .attr("class", "crosshair")
       .call(crosshair);
   if (loadType == "monthRate") {
        monthlyRevenueDate.text(d3.timeFormat("%Y/%m")(priceDataArr[priceDataArr.length - 1].date));
        stockValue.text(priceDataArr[priceDataArr.length - 1].price);
        monthlyRevenueText.text("月營收：");
        monthlyRevenueTextValue.text(monthEarnDataArr[monthEarnDataArr.length - 1].earn + " (百萬)");
    } else {
       // svgText.text(d3.timeFormat("%Y/%m")(priceDataArr[priceDataArr.length - 1].date) + "\u00A0\u00A0\u00A0\u00A0股價：" + priceDataArr[priceDataArr.length - 1].price); 
       // svgText2.text("月營收年增率：" + );
        monthlyRevenueText.text("月營收年增率：");
       monthlyRevenueDate.text(d3.timeFormat("%Y/%m")(priceDataArr[priceDataArr.length - 1].date));
       stockValue.text(priceDataArr[priceDataArr.length - 1].price);
       monthlyRevenueTextValue.text(monthEarnDataArr[monthEarnDataArr.length - 1].revenue + "(%)");
    }
    
 }
   
function drawBar(data, priceData) {
   svg.selectAll("*").remove();
   monthEarnDataArr = data;
   data.reverse();
   x.domain(priceData.map(candlestickMonthly.accessor().d));
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
       .attr("class", "x axis monthlyRevenue")
       .attr("transform", "translate(0," + height + ")")
//        .call(xAxis.ticks(20).tickFormat(d3.timeFormat("%Y%m")).tickSize(-height, -height));
   
       .call(d3.axisBottom(x).ticks(width / 50).tickFormat(d3.timeFormat("%Y%m")).tickSize(-height, -height));    
   
   // Add the Y2 Axis
   svg.append("g")
       .attr("class", "y axis monthlyRevenue")
       .attr("transform", "translate(" + width + ",0)")
       .call(d3.axisRight(y2).ticks(5).tickSize(-width, -width));
   svg.append("g")
       .attr("transform", "translate(" + (width + 40) + ",0)")
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
   x.domain(priceData.map(candlestickMonthly.accessor().d));
   xScale.domain(data.map(function(d){return d.date;}));
   
   svg.append("g")
       .attr("class", "x axis monthlyRevenue")
       .append("line")
       .attr("y1", y2(0))
       .attr("y2", y2(0))
       .attr("x2", width);
     // Add the X Axis
   svg.append("g")
       .attr("class", "x axis monthlyRevenue")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(x).ticks(width / 50).tickFormat(d3.timeFormat("%Y%m")).tickSize(-height, -height));
   
   
   // Add the Y2 Axis
   svg.append("g")
       .attr("class", "y axis monthlyRevenue")
       .attr("transform", "translate(" + width + ",0)")
       .call(d3.axisRight(y2).ticks(5).tickSize(-width, -width));
   
   svg.append("g")
       .attr("transform", "translate(" + (width + 20) + ",0)")
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
  


function monthRevenueResize() {
    var originWidth = parseInt(d3.select("#monthlyRevenue").style('width'), 10);
    width = originWidth - monthlyRevenueMargin.left - monthlyRevenueMargin.right;
//    d3.select(".textSvg").attr("width", width)
    // svg.attr("width", width);
    // textSvg.attr("width", width);
    d3.select(".monthlyChartSvg").attr("width", originWidth);
    d3.select(".monthlyTextSvg").attr("width", originWidth);
   // console.log("Resize width :" + width);
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
    svg.select("g.x.axis.monthlyRevenue").call(xAxis.ticks(width / 50).tickFormat(d3.timeFormat("%Y%m")));
    svg.select("g.y.axis.monthlyRevenue")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y2).ticks(5).tickSize(-width, -width));
    
}



function loadJSON(earnData, priceData) {
   svg.selectAll("*").remove();  
   loadType = "monthRate";
   d3.json(earnData ,function(error, data) {
       if (error) throw error;
//        console.log(data);
       var jsonData = data["Data"];
       
       var newEarnData = jsonData.map(function(d) {
           return {
               date: parseTime(d[0]),
               earn: +(Math.round(d[5]/ 1000))
           };
       });
//        console.log(jsonData);
//        console.log(newEarnData);

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
   
function monthlyMove(coords, index) {    
   var i;
   console.log()
       for (i = 0; i < monthEarnDataArr.length; i ++) {
//            console.log(monthEarnDataArr[i].date);
           
           if ((d3.timeFormat("%Y/%m/%d")(coords.x) === d3.timeFormat("%Y/%m/%d")(priceDataArr[i].date))) {
               if (loadType == "monthRate") {
                  // svgText.text(d3.timeFormat("%Y/%m")(coords.x) + "\u00A0\u00A0\u00A0\u00A0股價：" + priceDataArr[i].price);
                  // svgText2.text("月營收：" + monthEarnDataArr[i].earn + " (百萬)"); 
                monthlyRevenueText.text("月營收：");
                monthlyRevenueDate.text(d3.timeFormat("%Y/%m")(priceDataArr[i].date));
                stockValue.text(priceDataArr[i].price); 
                monthlyRevenueTextValue.text(monthEarnDataArr[i].earn + " (百萬)");
               } else {
                  //  svgText.text(d3.timeFormat("%Y/%m")(coords.x) + "\u00A0\u00A0\u00A0\u00A0股價：" + priceDataArr[priceDataArr.length - 1].price); 
                  // svgText2.text("月營收年增率：" + monthEarnDataArr[i].revenue + "(%)"); 
                monthlyRevenueText.text("月營收年增率：");
                monthlyRevenueDate.text(d3.timeFormat("%Y/%m")(priceDataArr[i].date));
                stockValue.text(priceDataArr[i].price);
                monthlyRevenueTextValue.text(monthEarnDataArr[i].revenue + "(%)");
               }
               
               
                            
           }
       }

}   

