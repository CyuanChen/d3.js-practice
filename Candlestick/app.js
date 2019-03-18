var margin = {top: 20, right: 50, bottom: 30, left: 60},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y%m%d");
var monthDate = d3.timeParse("%Y%m");

var x = techan.scale.financetime()
        .range([0, width]);
var crosshairY = d3.scaleLinear()
        .range([height, 0]);

var y = d3.scaleLinear()
        .range([height - 60, 0]);

var yVolume = d3.scaleLinear()
        .range([height , height - 60]);

var xScale = d3.scaleBand().range([0, width]).padding(0.15);

var sma0 = techan.plot.sma()
        .xScale(x)
        .yScale(y);

var sma1 = techan.plot.sma()
        .xScale(x)
        .yScale(y);
var ema2 = techan.plot.ema()
        .xScale(x)
        .yScale(y);
var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);

var zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [width, height]])
        .extent([[margin.left, margin.top], [width, height]])
        .on("zoom", zoomed);
var zoomableInit, yInit;

var volume = techan.plot.volume()
        .accessor(candlestick.accessor())
        .xScale(x)
        .yScale(yVolume);
var xAxis = d3.axisBottom()
        .scale(x);

var yAxis = d3.axisLeft()
        .scale(y);
var volumeAxis = d3.axisLeft(yVolume)
        .ticks(4)
        .tickFormat(d3.format(",.3s"));
var ohlcAnnotation = techan.plot.axisannotation()
        .axis(yAxis)
        .orient('left')
        .format(d3.format(',.2f'));
var timeAnnotation = techan.plot.axisannotation()
        .axis(xAxis)
        .orient('bottom')
        .format(d3.timeFormat('%Y-%m-%d'))
        .translate([0, height]);


var crosshair = techan.plot.crosshair()
        .xScale(x)
        .yScale(crosshairY)
        .xAnnotation(timeAnnotation)
        .yAnnotation(ohlcAnnotation)
//        .on("enter", enter)
//        .on("out", out)
        .on("move", move);
var textSvg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgText = textSvg.append("g")
            .attr("class", "description")
            .append("text")
//            .attr("x", margin.left)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .text("");

var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("pointer-events", "all")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var dataArr;
var fileName;
loadJSON("data.json");

function loadJSON(file) {
    fileName = file;
    svg.selectAll("*").remove();
    d3.json(file, function(error, data) {
    var accessor = candlestick.accessor();
    var jsonData = data["Data"];
    
    data = 
        jsonData
        .map(function(d) {
        return {
            date: parseDate(d[0]),
            open: +d[3],
            high: +d[4],
            low: +d[5],
            close: +d[6],
            volume: +d[9],
            change: +d[7],
            percentChange: +d[8],
            fiveMA: +d[10],
            twentyMA: +d[11],
            sixtyMA: +d[12]
        };
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
    
    
    var newData = jsonData.map(function(d) {
        return {
            date: parseDate(d[0]),
            volume: d[9]
        }
    }).reverse();
        
    svg.append("g")
            .attr("class", "candlestick");
    svg.append("g")
            .attr("class", "sma ma-0");
    svg.append("g")
            .attr("class", "sma ma-1");
    svg.append("g")
            .attr("class", "ema ma-2");
    svg.append("g")
            .attr("class", "volume axis");
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    svg.append("g")
            .attr("class", "y axis")
            .append("text")
//            .attr("transform", "rotate(-90)")
//            .attr("x", )
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("Price (TWD)");
    
    
    // Data to display initially
    draw(data.slice(0, data.length), newData, "date");
    // Only want this button to be active if the data has loaded
    d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
});
}
function loadJSON2(file) {
    fileName = file;
    svg.selectAll("*").remove();
    d3.json(file, function(error, data) {
    var accessor = candlestick.accessor();
    var jsonData = data["Data"];
//    console.log(jsonData);
    data = 
        jsonData
//            .slice(0, 200)
        .map(function(d) {
        return {
            date: monthDate(d[0]),
            open: +d[3],
            high: +d[4],
            low: +d[5],
            close: +d[6],
            volume: +d[10],
            change: +d[7],
            percentChange: +d[8],
//            fiveMA: +d[10],
//            twentyMA: +d[11],
//            sixtyMA: +d[12]
        };
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
    
    
    var newData = jsonData.map(function(d) {
        return {
            date: monthDate(d[0]),
            volume: d[10]
        }
    }).reverse();
        
    svg.append("g")
            .attr("class", "candlestick");
    svg.append("g")
            .attr("class", "sma ma-0");
    svg.append("g")
            .attr("class", "sma ma-1");
    svg.append("g")
            .attr("class", "ema ma-2");
//    svg.append("g")
//            .attr("class", "volume");
    svg.append("g")
            .attr("class", "volume axis");
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("y", -10)
//            .attr("transform", "rotate(-90)")
//            .attr("x", )
//            .attr("y", 6)
//            .attr("dx", ".03em")
//            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price (TWD)");
    
    
    // Data to display initially
    draw(data.slice(0, data.length), newData, "month");
    // Only want this button to be active if the data has loaded
    d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
});
}


function draw(data, volumeData, type) {

    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
    xScale.domain(volumeData.map(function(d){return d.date;}))
    yVolume.domain(techan.scale.plot.volume(data).domain());

    
    // Add a clipPath: everything out of this area won't be drawn.
  var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);
    
    xScale.range([0, width].map(d => d));
    var chart = svg.selectAll("volumeBar")
        .append("g")
        
        .data(volumeData)
        .enter().append("g")
        .attr("clip-path", "url(#clip)")
        ;
    chart.append("rect")
        .attr("class", "volumeBar")
        .attr("x", function(d) {return xScale(d.date);})
        .attr("height", function(d){
            return  height - yVolume(d.volume);
        })
        .attr("y", function(d) {
            return yVolume(d.volume);
        })
        .attr("width", xScale.bandwidth())
        .style("fill", function(d, i) {
            if (data[i].change > 0) { return "#FF0000"} else if (data[i].change < 0) {
               return "#00AA00"
            } else {
               return "#DDDDDD" 
            }            
    });
    svg.selectAll("g.x.axis").call(xAxis.ticks(7).tickFormat(d3.timeFormat("%m/%d")).tickSize(-height, -height));
    svg.selectAll("g.y.axis").call(yAxis.ticks(10).tickSize(-width, -width));
      
    var state = svg.selectAll("g.candlestick")
        .attr("clip-path", "url(#clip)")
        .datum(data);
    state.call(candlestick)
        .each(function(d) {
        dataArr = d;
    });
    
    svg.select("g.sma.ma-0").attr("clip-path", "url(#clip)").datum(techan.indicator.sma().period(10)(data)).call(sma0);
    svg.select("g.sma.ma-1").attr("clip-path", "url(#clip)").datum(techan.indicator.sma().period(20)(data)).call(sma0);
    svg.select("g.ema.ma-2").attr("clip-path", "url(#clip)").datum(techan.indicator.sma().period(50)(data)).call(sma0);
    svg.select("g.volume.axis").call(volumeAxis);
    
    svg.append("g")
    .attr("class", "crosshair")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all")
    .call(crosshair)
    .call(zoom);
    
    
    zoomableInit = x.zoomable().clamp(false).copy();
    yInit = y.copy();
}


function move(coords, index) {
//    console.log("move");
    var i;
    for (i = 0; i < dataArr.length; i ++) {
        if (coords.x === dataArr[i].date) {
            svgText.text(d3.timeFormat("%Y/%m/%d")(coords.x) + ", 開盤：" + dataArr[i].open + ", 高：" + dataArr[i].high + ", 低："+ dataArr[i].low + ", 收盤："+ dataArr[i].close + ", 漲跌：" + dataArr[i].change + "(" + dataArr[i].percentChange + "%)" + ", 成交量：" + dataArr[i].volume); 
//                         + "(" + dataArr[i].percentChange + "%)" + ", 成交量： " + dataArr[i].volume + ", 5MA: " + dataArr[i].fiveMA + ", 20MA: " + dataArr[i].twentyMA + ", 60MA: " + dataArr[i].sixtyMA );
        }
    }
}

var rescaledX, rescaledY, rescaledYVolume;
var t;
function zoomed() {
//    console.log("zoomed");
    t = d3.event.transform;
    rescaledX = d3.event.transform.rescaleY(x);
    rescaledY = d3.event.transform.rescaleY(y);
    rescaledYVolume = d3.event.transform.rescaleY(yVolume);
//    xAxis.scale(rescaledX);
    yAxis.scale(rescaledY);
    candlestick.yScale(rescaledY);
    sma0.yScale(rescaledY);
    sma1.yScale(rescaledY);
    ema2.yScale(rescaledY);
    
   // Emulates D3 behaviour, required for financetime due to secondary zoomable scale
    x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
    xScale.range([0, width].map(d => d3.event.transform.applyX(d)));
    
    redraw();
}



function redraw() {
    svg.select("g.candlestick").call(candlestick);
    svg.select("g.x.axis").call(xAxis);
    svg.select("g.y.axis").call(yAxis);
    svg.select("g.sma.ma-0").call(sma0);
    svg.select("g.sma.ma-1").call(sma1);
    svg.select("g.ema.ma-2").call(ema2);
//    svg.select("g.volume.axis").call(volumeAxis);
//    svg.selectAll("g.volumeBar")
//        .attr("x", function(d) {return rescaledX(d.date)})
//        .attr("y", function(d) {
//            return rescaledY(d.volume);
//        });
//        .attr("height", function(d){
//            return  height - yVolume(d.volume);
//        });
    
//    svg.selectAll("g.volumeBar").remove();
    console.log("T.k: " + t.k);
    svg.selectAll("rect.volumeBar")
//        .attr("transform", t)
//        .attr("transform", rescaledX)
//        .attr("transform", d3.zoomIdentity.translate(t.x, 0))
//        .attr("transform", "translate(0, " + t.x + ") scale(" + t.k + ")")
//        .append("g")
//        .attr("class", "volumeBar")
//        .append("rect")
        .attr("x", function(d) {return xScale(d.date);})
//        .attr("height", function(d){
//            return  height - yVolume(d.volume);
//        })
//        .attr("y", function(d) {
//            return t.y(d.volume) ;
//        })
        .attr("width", (xScale.bandwidth()));
    
    

}









