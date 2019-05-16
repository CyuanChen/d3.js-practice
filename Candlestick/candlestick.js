var margin = {top: 20, right: 20, bottom: 30, left: 70};
            
var width = parseInt(d3.select(".candlestickChartSvg").style('width'), 10) - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;


// 設定文字區域
var textSvg = d3.select(".candlestickTextSvg")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//設定顯示文字，web版滑鼠拖曳就會顯示，App上則是要點擊才會顯示
var svgText = textSvg.append("g")
            .attr("class", "description")
            .append("text")
//            .attr("x", margin.left)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .text("");
//設定畫圖區域
var svg = d3.select(".candlestickChartSvg")
        .attr("pointer-events", "all")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// 設定時間格式
var parseDate = d3.timeParse("%Y%m%d");
var monthDate = d3.timeParse("%Y%m");

// K線圖的x
var x = techan.scale.financetime()
        .range([0, width]);
var crosshairY = d3.scaleLinear()
        .range([height, 0]);
// K線圖的y
var y = d3.scaleLinear()
        .range([height - 60, 0]);
// 成交量的y
var yVolume = d3.scaleLinear()
        .range([height , height - 60]);
//成交量的x
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
        .scaleExtent([1, 5]) //設定縮放大小1 ~ 5倍
        .translateExtent([[0, 0], [width, height]]) // 設定可以縮放的範圍，註解掉就可以任意拖曳
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

var zoomableInit, yInit;
var xAxis = d3.axisBottom()
        .scale(x);

var yAxis = d3.axisLeft()
        .scale(y);

var volumeAxis = d3.axisLeft(yVolume)
        .ticks(4)
        .tickFormat(d3.format(",.2s"));
var ohlcAnnotation = techan.plot.axisannotation()
        .axis(yAxis)
        .orient('left')
        .format(d3.format(',.2f'));
var timeAnnotation = techan.plot.axisannotation()
        .axis(xAxis)
        .orient('bottom')
        .format(d3.timeFormat('%Y-%m-%d'))
        .translate([0, height]);

// 設定十字線
var crosshair = techan.plot.crosshair()
        .xScale(x)
        .yScale(crosshairY)
        .xAnnotation(timeAnnotation)
        .yAnnotation(ohlcAnnotation)
        .on("move", move);
var dataArr;

loadJSON("https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/CyuanChen/d3.js-practice/master/Candlestick/data.json", "date");


window.addEventListener('resize', resize );


 // Add a clipPath: everything out of this area won't be drawn.
var clip, candlestickClip;
//var crosshairClip = svg.append("defs").append("svg:clipPath")
//      .attr("id", "crosshairClip")
//      .append("svg:rect")
//      .attr("width", width + margin.left)
//      .attr("height", height )
//      .attr("x", 0)
//      .attr("y", 0);

function loadJSON(file, type) {
    svg.selectAll("*").remove(); // 切換不同資料需要重新畫圖，因此需要先清除原先的圖案
    d3.json(file, function(error, data) {
    var accessor = candlestick.accessor();
    var jsonData = data["Data"];
    
    data = 
        jsonData
        .map(function(d) { // 設定data的格式
        if (type == "date") {
           return {
            date: parseDate(d[0]),
            open: +d[3],
            high: +d[4],
            low: +d[5],
            close: +d[6],
            volume: +d[9],
            change: +d[7],
            percentChange: +d[8],
        }; 
        } else {
            return {
            date: monthDate(d[0]),
            open: +d[3],
            high: +d[4],
            low: +d[5],
            close: +d[6],
            volume: +d[10],
            change: +d[7],
            percentChange: +d[8],
        };
        }
        
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
    
//    console.log(data);
    
    var newData = jsonData.map(function(d) {
        if (type == "date") {
            return {
            date: parseDate(d[0]),
            volume: d[9]
            }
        } else {
            return {
            date: monthDate(d[0]),
            volume: d[10]
            }
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
            .attr("x", 10)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("Price (TWD)");
        
    clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);
    candlestickClip = svg.append("defs").append("svg:clipPath")
      .attr("id", "candlestickClip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height - 60 )
      .attr("x", 0)
      .attr("y", 0);
    // Data to display initially
    drawData = data.slice(0, data.length);
    drawVolumeData = newData    
    draw(data.slice(0, data.length), newData);
   
});
}

console.log(width);

function draw(data, volumeData) {
    // 設定domain，決定各座標所用到的資料
    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
    xScale.domain(volumeData.map(function(d){return d.date;}))
    yVolume.domain(techan.scale.plot.volume(data).domain());

    
   
    
    xScale.range([0, width].map(d => d)); // 設定xScale回到初始值
    var chart = svg.selectAll("volumeBar") // 畫成交量bar chart
        .append("g")
        .data(volumeData)
        .enter().append("g")
        .attr("clip-path", "url(#clip)");
    
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
        .style("fill", function(d, i) { // 根據漲跌幅去決定成交量的顏色
            if (data[i].change > 0) { return "#FF0000"} else if (data[i].change < 0) {
               return "#00AA00"
            } else {
               return "#DDDDDD" 
            }            
    });
   
   // 畫X軸 
    svg.selectAll("g.x.axis").call(xAxis.ticks(width / 70).tickFormat(d3.timeFormat("%m/%d")).tickSize(-height, -height));
    
    //畫K線圖Y軸
    svg.selectAll("g.y.axis").call(yAxis.ticks(10).tickSize(-width, -width));
      
    //畫Ｋ線圖
    var state = svg.selectAll("g.candlestick")
        .attr("clip-path", "url(#candlestickClip)")
        .datum(data);
    state.call(candlestick)
        .each(function(d) {
        dataArr = d;
    });
    
    svg.select("g.sma.ma-0").attr("clip-path", "url(#candlestickClip)").datum(techan.indicator.sma().period(10)(data)).call(sma0);
    svg.select("g.sma.ma-1").attr("clip-path", "url(#candlestickClip)").datum(techan.indicator.sma().period(20)(data)).call(sma0);
    svg.select("g.ema.ma-2").attr("clip-path", "url(#candlestickClip)").datum(techan.indicator.sma().period(50)(data)).call(sma0);
    svg.select("g.volume.axis").call(volumeAxis);
    
    // 畫十字線並對他設定zoom function
    svg.append("g")
    .attr("class", "crosshair")
//    .attr("clip-path", "url(#crosshairClip)")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all")
    .call(crosshair)
    .call(zoom);
    
    //設定zoom的初始值
    zoomableInit = x.zoomable().clamp(false).copy();
    yInit = y.copy();
}

//設定當移動的時候要顯示的文字
function move(coords, index) {
//    console.log("move");
    var i;
    for (i = 0; i < dataArr.length; i ++) {
        if (coords.x === dataArr[i].date) {
            svgText.text(d3.timeFormat("%Y/%m/%d")(coords.x) + ", 開盤：" + dataArr[i].open + ", 高：" + dataArr[i].high + ", 低："+ dataArr[i].low + ", 收盤："+ dataArr[i].close + ", 漲跌：" + dataArr[i].change + "(" + dataArr[i].percentChange + "%)" + ", 成交量：" + dataArr[i].volume); 

        }
    }
}

var rescaledX, rescaledY;
var t;
function zoomed() {
//    console.log("zoomed");
    
    //根據zoom去取得座標轉換的資料
    t = d3.event.transform;
    rescaledX = d3.event.transform.rescaleY(x);
    rescaledY = d3.event.transform.rescaleY(y);
    // y座標zoom
//    yAxis.scale(rescaledY);
//    candlestick.yScale(rescaledY);
//    sma0.yScale(rescaledY);
//    sma1.yScale(rescaledY);
//    ema2.yScale(rescaledY);
    
   // Emulates D3 behaviour, required for financetime due to secondary zoomable scale
    //x座標zoom
    x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
    // 成交量x座標 zoom
    xScale.range([0, width].map(d => d3.event.transform.applyX(d)));
//    y.range([height, 0].map(d => d3.event.transform.applyY(d)));
    // 更新座標資料後，再重新畫圖
    redraw();
}



function redraw() {
    svg.select("g.candlestick").call(candlestick);
    svg.select("g.x.axis").call(xAxis);
    svg.select("g.y.axis").call(yAxis);
    svg.select("g.sma.ma-0").call(sma0);
    svg.select("g.sma.ma-1").call(sma1);
    svg.select("g.ema.ma-2").call(ema2);

    
//    svg.selectAll("g.volumeBar").remove();
    svg.selectAll("rect.volumeBar")
//        .attr("transform", t)
//        .attr("transform", rescaledX)
//        .attr("transform", d3.zoomIdentity.translate(t.x, 0))
//        .attr("transform", "translate(0, " + t.x + ") scale(" + t.k + ")")
//        .append("g")
//        .attr("class", "volumeBar")
//        .append("rect")
        .attr("x", function(d) {return xScale(d.date);})
        .attr("width", (xScale.bandwidth()));
    
}


function resize() {
    width = parseInt(d3.select(".candlestickChartSvg").style('width'), 10);
    width = width - margin.left - margin.right;
//    d3.select(".textSvg").attr("width", width)

    console.log("Resize width :" + width);
    // K線圖的x
    x.range([0, width]);
    crosshairY.range([height, 0]);
    // K線圖的y
    y.range([height - 60, 0]);
    // 成交量的y
    yVolume.range([height , height - 60]);
    //成交量的x
    xScale.range([0, width]).padding(0.15);
    candlestickClip.attr("width", width);
    clip.attr("width", width);
//    crosshairClip.attr("width", width + margin.left)

    
    
    svg.select("g.candlestick").call(candlestick);
    svg.select("g.crosshair").attr("width", width).call(crosshair);
    svg.select("g.sma.ma-0").call(sma0);
    svg.select("g.sma.ma-1").call(sma1);
    svg.select("g.ema.ma-2").call(ema2);

    svg.selectAll("rect.volumeBar")
        .attr("x", function(d) {return xScale(d.date);})
        .attr("width", (xScale.bandwidth()));
    
//      svg.select("g.x.axis").call(xAxis);
    svg.select("g.x.axis").call(xAxis.ticks(width / 70));
    svg.select("g.y.axis").call(yAxis.ticks(10).tickSize(-width, -width));
    
}








