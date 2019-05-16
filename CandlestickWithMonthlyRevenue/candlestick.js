var margin = {top: 20, right: 35, bottom: 30, left: 46};

var candlestickWidth = parseInt(d3.select("#candlestick").style('width'), 10) - margin.left - margin.right;
            
var candlestickHeight = 500 - margin.top - margin.bottom;

// 設定時間格式
var parseDate = d3.timeParse("%Y%m%d");
var monthDate = d3.timeParse("%Y%m");

// K線圖的x
var candlestickX = techan.scale.financetime()
        .range([0, candlestickWidth]);
var crosshairY = d3.scaleLinear()
        .range([candlestickHeight, 0]);
// K線圖的y
var candlestickY = d3.scaleLinear()
        .range([candlestickHeight - 60, 0]);
// 成交量的y
var yVolume = d3.scaleLinear()
        .range([candlestickHeight , candlestickHeight - 60]);
//成交量的x
var candlestickXScale = d3.scaleBand().range([0, candlestickWidth]).padding(0.15);

var sma0 = techan.plot.sma()
        .xScale(candlestickX)
        .yScale(candlestickY);

var sma1 = techan.plot.sma()
        .xScale(candlestickX)
        .yScale(candlestickY);
var ema2 = techan.plot.ema()
        .xScale(candlestickX)
        .yScale(candlestickY);
var candlestick = techan.plot.candlestick()
        .xScale(candlestickX)
        .yScale(candlestickY);

var zoom = d3.zoom()
        .scaleExtent([1, 5]) //設定縮放大小1 ~ 5倍
        .translateExtent([[0, 0], [candlestickWidth, candlestickHeight]]) // 設定可以縮放的範圍，註解掉就可以任意拖曳
        .extent([[0, 0], [candlestickWidth, candlestickHeight]])
        .on("zoom", zoomed);

var zoomableInit, yInit;
var candlestickXAxis = d3.axisBottom()
        .scale(candlestickX);

var candlestickYAxis = d3.axisLeft()
        .scale(candlestickY);

var volumeAxis = d3.axisLeft(yVolume)
        .ticks(4)
        .tickFormat(d3.format(",.3s"));
var ohlcAnnotation = techan.plot.axisannotation()
        .axis(candlestickYAxis)
        .orient('left')
        .format(d3.format(',.1f'));
var timeAnnotation = techan.plot.axisannotation()
        .axis(candlestickXAxis)
        .orient('bottom')
        .format(d3.timeFormat('%Y-%m-%d'))
        .translate([0, candlestickHeight])
        .width(65);

// 設定十字線
var candlestickCrosshair = techan.plot.crosshair()
        .xScale(candlestickX)
        .yScale(crosshairY)
        .xAnnotation(timeAnnotation)
        .yAnnotation(ohlcAnnotation)
        .on("move", move);

// 設定文字區域
// var candlestickTextSvg = d3.select("#candlestick")
//         .append("svg")
//         .attr("class", "candlestickTextSvg")
//         .attr("width", candlestickWidth + margin.left + margin.right)
//         .attr("height", 120)
//         .append("g")
//         .attr("transform", "translate(" + 10 + "," + margin.top + ")");
var candlestickDiv = d3.select("#candlestick")
        .append("div")
        .attr("transform", "translate(" + 10 + "," + margin.top + ")");
//設定顯示文字，web版滑鼠拖曳就會顯示，App上則是要點擊才會顯示
//var candlestickSvgText = candlestickTextSvg
//            .append("text")
//             .attr("class", "candlestickSvgText")
////            .attr("x", margin.left)
//var candlestickSvgText2 = candlestickTextSvg
//            .append("text")
//            .attr("transform", "translate(0,25)")
//             .attr("class", "candlestickSvgText2")
////            .attr("x", margin.left)
//var candlestickSvgText3 = candlestickTextSvg
//            .append("text")
//            .attr("transform", "translate(0,50)")
//            .attr("class", "candlestickSvgText3")
////            .attr("x", margin.left)


var candlestickDate = candlestickDiv.append("div")
    .attr("id", "candlestickDate")
    .append("i").text("2019/05/14")

var start = candlestickDiv.append("div")
    .attr("id", "start")
    .append("p").text("開盤：")
var startValue = candlestickDiv.select("#start")
    .append("u")
var high = candlestickDiv.append("div")
    .attr("id", "high")
    // .attr("transform", "translate(0,25)")
    .append("p").text("高：")
var highValue = candlestickDiv.select("#high")
    .append("u")
var low = candlestickDiv.append("div")
    .attr("id", "low")
    // .attr("transform", "translate(0,25)")
    .append("p").text("低：")
var lowValue = candlestickDiv.select("#low")
    .append("u")
var close = candlestickDiv.append("div")
    .attr("id", "close")
    // .attr("transform", "translate(0,25)")
    .append("p").text("收：")
var closeValue = candlestickDiv.select("#close")
    .append("u")

var valueChange = candlestickDiv.append("div")
    .attr("id", "valueChange")
    // .attr("transform", "translate(0,50)")
    .append("p").text("漲跌：")
var valueChangeValue = candlestickDiv.select("#valueChange")
    .append("u")
var volumeCount = candlestickDiv.append("div")
    .attr("id", "volumeCount")
    // .attr("transform", "translate(0,50)")
    .append("p").text("成交量：");

var volumeCountValue = candlestickDiv.select("#volumeCount")
    .append("u");



// var candlestickSvgText2 = candlestickTextSvg
//             .append("text")
//             .attr("transform", "translate(0,25)")
//              .attr("class", "candlestickSvgText2")
// //            .attr("x", margin.left)
// var candlestickSvgText3 = candlestickTextSvg
//             .append("text")
//             .attr("transform", "translate(0,50)")
//             .attr("class", "candlestickSvgText3")
// //            .attr("x", margin.left)


//設定畫圖區域
var candlestickSvg = d3.select("#candlestick")
        .append("svg")
        .attr("class", "candlestickChartSvg")
        .attr("width", candlestickWidth + margin.left + margin.right)
        .attr("height", 500)
        .attr("pointer-events", "all")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

window.addEventListener('resize', resize );

 // Add a clipPath: everything out of this area won't be drawn.
var clip, candlestickClip;


var dataArr;
loadCandlestickJSON("https://cors-anywhere.herokuapp.com/https://gist.githubusercontent.com/CyuanChen/785b6404e22d798ffe390d1cd73b0ad5/raw/c5bbe2d3c50f34352833e78dccab99137e6239cb/2207Data.json", "date");

function loadCandlestickJSON(file, type) {
    candlestickSvg.selectAll("*").remove(); // 切換不同資料需要重新畫圖，因此需要先清除原先的圖案
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
    
    // console.log(data);
    
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
        
    candlestickSvg.append("g")
            .attr("class", "candlestick");
    candlestickSvg.append("g")
            .attr("class", "sma ma-0");
    candlestickSvg.append("g")
            .attr("class", "sma ma-1");
    candlestickSvg.append("g")
            .attr("class", "ema ma-2");
    candlestickSvg.append("g")
            .attr("class", "volume axis");
    candlestickSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + candlestickHeight + ")");

    candlestickSvg.append("g")
            .attr("class", "y axis")
        .attr("class", "y axis")
            .append("text")
            //            .attr("transform", "rotate(-90)")
            //            .attr("x", )
            .attr("y", -10)
            .style("text-anchor", "middle")
            .text("Price (TWD)");

//    candlestickSvg.append("g")
//       .append("text")
//       .attr("x", 30)
//       .attr("y", -10)
//       .style("text-anchor", "end")
//       .text("Price (TWD)");
        
    // Data to display initially
    drawCandlestick(data.slice(0, data.length), newData);
        
});
}

function drawCandlestick(data, volumeData) {
    // 設定domain，決定各座標所用到的資料
    candlestickX.domain(data.map(candlestick.accessor().d));
    candlestickY.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
    candlestickXScale.domain(volumeData.map(function(d){return d.date;}))
    yVolume.domain(techan.scale.plot.volume(data).domain());

    
    
    
    // Add a clipPath: everything out of this area won't be drawn.
    clip = candlestickSvg.append("defs").append("candlestickSvg:clipPath")
      .attr("id", "clip")
      .append("candlestickSvg:rect")
      .attr("width", candlestickWidth )
      .attr("height", candlestickHeight )
      .attr("x", 0)
      .attr("y", 0);
    
    candlestickClip = candlestickSvg.append("defs").append("candlestickSvg:clipPath")
      .attr("id", "candlestickClip")
      .append("candlestickSvg:rect")
      .attr("width", candlestickWidth )
      .attr("height", candlestickHeight - 60 )
      .attr("x", 0)
      .attr("y", 0);
    
    candlestickXScale.range([0, candlestickWidth].map(d => d)); // 設定candlestickXScale回到初始值
    var chart = candlestickSvg.selectAll("volumeBar") // 畫成交量bar chart
        .append("g")
        .data(volumeData)
        .enter().append("g")
        .attr("clip-path", "url(#clip)");
    
    chart.append("rect")
        .attr("class", "volumeBar")
        .attr("x", function(d) {return candlestickXScale(d.date);})
        .attr("height", function(d){
            return  candlestickHeight - yVolume(d.volume);
        })
        .attr("y", function(d) {
            return yVolume(d.volume);
        })
        .attr("width", candlestickXScale.bandwidth())
        .style("fill", function(d, i) { // 根據漲跌幅去決定成交量的顏色
            if (data[i].change > 0) { return "#FF0000"} else if (data[i].change < 0) {
               return "#00AA00"
            } else {
               return "#DDDDDD" 
            }            
    });

   
   // 畫X軸 
    candlestickSvg.selectAll("g.x.axis").call(candlestickXAxis.ticks(candlestickWidth / 70).tickFormat(d3.timeFormat("%m/%d")).tickSize(-candlestickHeight, -candlestickHeight));
    
    //畫K線圖Y軸
    candlestickSvg.selectAll("g.y.axis").call(candlestickYAxis.ticks(10).tickSize(-candlestickWidth, -candlestickWidth));
      
    //畫Ｋ線圖
    var state = candlestickSvg.selectAll("g.candlestick")
        .attr("clip-path", "url(#candlestickClip)")
        .datum(data);
    state.call(candlestick)
        .each(function(d) {
        dataArr = d;
    });
    
    candlestickSvg.select("g.sma.ma-0").attr("clip-path", "url(#candlestickClip)").datum(techan.indicator.sma().period(10)(data)).call(sma0);
    candlestickSvg.select("g.sma.ma-1").attr("clip-path", "url(#candlestickClip)").datum(techan.indicator.sma().period(20)(data)).call(sma0);
    candlestickSvg.select("g.ema.ma-2").attr("clip-path", "url(#candlestickClip)").datum(techan.indicator.sma().period(50)(data)).call(sma0);
    candlestickSvg.select("g.volume.axis").call(volumeAxis);
    
    // 畫十字線並對他設定zoom function
    candlestickSvg.append("g")
    .attr("class", "crosshair candlestick")
    .attr("width", candlestickWidth)
    .attr("height", candlestickHeight)
    .attr("pointer-events", "all")
    .call(candlestickCrosshair)
    .call(zoom);
    

    candlestickDate.text(d3.timeFormat("%Y/%m/%d")(dataArr[dataArr.length - 1].date));
    startValue.text(dataArr[dataArr.length - 1].open);
    highValue.text(dataArr[dataArr.length - 1].high);
    lowValue.text(dataArr[dataArr.length - 1].low);
    closeValue.text(dataArr[dataArr.length - 1].close);
    valueChangeValue.text(dataArr[dataArr.length - 1].change);
    volumeCountValue.text(dataArr[dataArr.length - 1].volume);

    //設定zoom的初始值
    zoomableInit = candlestickX.zoomable().clamp(false).copy();
    yInit = candlestickY.copy();

}

//設定當移動的時候要顯示的文字
function move(coords, index) {
//    console.log("move");
    var i;
    for (i = 0; i < dataArr.length; i ++) {
       if (coords.x === dataArr[i].date) {
            candlestickDate.text(d3.timeFormat("%Y/%m/%d")(dataArr[i].date));
            startValue.text(dataArr[i].open);
            highValue.text(dataArr[i].high);
            lowValue.text(dataArr[i].low);
            closeValue.text(dataArr[i].close);
            valueChangeValue.text(dataArr[i].change);
            volumeCountValue.text(dataArr[i].volume);
       }
    }
}

var rescaledX, rescaledY;
var t;
function zoomed() {
//    console.log("zoomed");
    
    //根據zoom去取得座標轉換的資料
    t = d3.event.transform;
    rescaledX = d3.event.transform.rescaleY(candlestickX);
    rescaledY = d3.event.transform.rescaleY(candlestickY);
    // y座標zoom
//    yAxis.scale(rescaledY);
//    candlestick.yScale(rescaledY);
//    sma0.yScale(rescaledY);
//    sma1.yScale(rescaledY);
//    ema2.yScale(rescaledY);
    
   // Emulates D3 behaviour, required for financetime due to secondary zoomable scale
    //x座標zoom
    candlestickX.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
    // 成交量x座標 zoom
    candlestickXScale.range([0, candlestickWidth].map(d => d3.event.transform.applyX(d)));
//    y.range([candlestickHeight, 0].map(d => d3.event.transform.applyY(d)));
    // 更新座標資料後，再重新畫圖
    redraw();
}



function redraw() {
    candlestickSvg.select("g.candlestick").call(candlestick);
    candlestickSvg.select("g.x.axis").call(candlestickXAxis);
    candlestickSvg.select("g.y.axis").call(candlestickYAxis);
    candlestickSvg.select("g.sma.ma-0").call(sma0);
    candlestickSvg.select("g.sma.ma-1").call(sma1);
    candlestickSvg.select("g.ema.ma-2").call(ema2);
    candlestickSvg.selectAll("rect.volumeBar")
        .attr("x", function(d) {return candlestickXScale(d.date);})
        .attr("width", (candlestickXScale.bandwidth()));

}


function resize() {
    var originCandlestickWidth = parseInt(d3.select("#candlestick").style('width'), 10);
    candlestickWidth = originCandlestickWidth - margin.left - margin.right;

    d3.select(".candlestickChartSvg").attr("width", originCandlestickWidth);
    d3.select(".candlestickTextSvg").attr("width", originCandlestickWidth);

    // console.log("Resize width :" + candlestickWidth);
    // K線圖的x
    candlestickX.range([0, candlestickWidth]);
    crosshairY.range([candlestickHeight, 0]);
    // K線圖的y
    candlestickY.range([candlestickHeight - 60, 0]);
    // 成交量的y
    yVolume.range([candlestickHeight , candlestickHeight - 60]);
    //成交量的x
    candlestickXScale.range([0, candlestickWidth]).padding(0.15);
    candlestickClip.attr("width", candlestickWidth);
    clip.attr("width", candlestickWidth);
//    crosshairClip.attr("width", width + margin.left)

    
    
    candlestickSvg.select("g.candlestick").call(candlestick);
    candlestickSvg.select("g.crosshair.candlestick").attr("width", candlestickWidth).call(crosshair);
    candlestickSvg.select("g.sma.ma-0").call(sma0);
    candlestickSvg.select("g.sma.ma-1").call(sma1);
    candlestickSvg.select("g.ema.ma-2").call(ema2);

    candlestickSvg.selectAll("rect.volumeBar")
        .attr("x", function(d) {return candlestickXScale(d.date);})
        .attr("width", (candlestickXScale.bandwidth()));
    
//      svg.select("g.x.axis").call(xAxis);
    candlestickSvg.select("g.x.axis").call(candlestickXAxis.ticks(candlestickWidth / 70));
    candlestickSvg.select("g.y.axis").call(candlestickYAxis.ticks(10).tickSize(-candlestickWidth, -candlestickWidth));
    
}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}