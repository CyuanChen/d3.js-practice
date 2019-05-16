var margin = {top: 30, right: 100, bottom: 80, left: 20},
    width = parseInt(d3.select(".chartSvg").style('width'), 10) - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// 設定時間格式
//var parseDate = d3.timeParse("%Y%m%d");
//var monthDate = d3.timeParse("%Y%m");

// 設定文字區域
var textSvg = d3.select(".textSvg")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//設定畫圖區域
var svg = d3.select(".chartSvg")
        .attr("pointer-events", "all")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



//var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top +")");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var z = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisRight(y);

var line = d3.line()
    .x(function(d) {return x(d.season);})
    .y(function(d) {return y(d.value);})
var firstSeason;
var legendKeys = ["毛利率", "營業利益率", "稅後純益率"]
var colorWithKeys = { 毛利率: "steelblue" , 營業利益率: "green", 稅後純益率: "red"}
var colors = ["steelblue", "green", "red"];
var jsonArray = [];
var lineData;

loadJSON("1102Data.json");

window.addEventListener('resize', resize );

function loadJSON(file) {
    svg.selectAll("*").remove(); // 切換不同資料需要重新畫圖，因此需要先清除原先的圖案
    jsonArray = [];
    d3.json(file, function(error, data) {
    var jsonData = data["Data"];
    var dataArr = [55,59,65];
    var newData = dataArr.map(function(id) {
        var i = jsonData.length + 1; // 目前資料是一次20筆，若會更改資料量這邊要做更正
        return {
            id: id,
            values: jsonData.map(function(d) {
                jsonArray.push(+d[id]);
                i -= 1
                return { season: i, value: +d[id]}
            }).reverse()
        }
    })
     firstSeason = +jsonData.reverse()[0][0]
//    console.log(firstSeason);
//    console.log(newData);
    lineData = newData;
    draw(newData);
})
}

var GPMData, OPMData, PROMData;
var drawFirstTime = true;
var xAxisArray = [];

function draw(data) {
    x.domain([1, 20]);
    console.log(data);
    var yMin = d3.min(jsonArray, function(d){return d});
    var yMax = d3.max(jsonArray, function(d){return d});
    console.log((Math.floor(yMin / 10) - 1) * 10  + ", " + (Math.ceil(yMax / 10) + 1) * 10);
    
    y.domain([(Math.floor(yMin / 10) - 1) * 10, (Math.ceil(yMax / 10) + 1) * 10]);
    z.domain(data.map(function(d) {return d.id;}))
    
    svg.append("g")
        .attr("class", "y axis");
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");
    
    var year = Math.floor(firstSeason/ 100);
    var a = firstSeason % 4 - 1;
    
    svg.select("g.x.axis")
        .call(xAxis.ticks(20)
              .tickFormat(function(d) { 
                if (drawFirstTime == true) {        
                    var sum = (year + Math.floor(a / 4)) + "Q" + ((a % 4) + 1);
                    a += 1;
                    xAxisArray.push(sum);
                    return sum;
                } else {
                    return xAxisArray[d - 1];
                }

        })
    )
    .selectAll("text")
    .attr("transform", "translate(0, 10)");
    
    drawFirstTime = false
    
    svg.select("g.y.axis")
    .call(yAxis.ticks(6).tickSize(width))
    .selectAll("text")
    .attr("transform", "translate(10,0)")
    
    svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "translate(" + (width + 20) + ",0)")
            .attr("x", 0)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("(%)");
    
    
    GPMData = data[0].values;
    OPMData = data[1].values;
    PROMData = data[2].values;
    // 針對y軸做虛線
    svg.select(".y.axis")
        .selectAll(".tick:not(:first-of-type) line")
        .attr("stroke", "#777")
        .attr("stroke-dasharray", "2.2");
    
    
    svg.selectAll(".category")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "category")
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke-width", 1.8)
        .attr("d", function(d) { 
        return line(d.values)})
        .style("stroke", function(d, i) {
        return colors[i];
        })
    

    svg.selectAll(".dot.GPM")
        .data(GPMData)
        .enter().append("circle")
        .attr("class", "dot GPM")
        .attr("r", 3.5)
        .attr("cx", function(d) {return x(d.season);})
        .attr("cy", function(d) {return y(d.value);})
        .attr("opacity", 1)

    svg.selectAll(".dot.OPM")
        .data(OPMData)
        .enter().append("circle")
        .attr("class", "dot OPM")
        .attr("r", 3.5)
        .attr("cx", function(d) {return x(d.season);})
        .attr("cy", function(d) {return y(d.value);})
        .attr("opacity", 1)

    svg.selectAll(".dot.PROM")
        .data(PROMData)
        .enter().append("circle")
        .attr("class", "dot PROM")
        .attr("r", 3.5)
        .attr("cx", function(d) {return x(d.season);})
        .attr("cy", function(d) {return y(d.value);})
        .attr("opacity", 1)
    
    
    var lineLegend = textSvg.selectAll(".lineLegend")
        .data(legendKeys)
        .enter().append("g")
        .attr("class", "lineLegend")
        .attr("transform", function(d, i) {
//            return "translate(" + (margin.left + i*150) + "," + (0) + ")";
            return "translate(" + margin.left + "," + i*25 + ")";
        })
    lineLegend.append("text")
        .text(function(d) { return d;})
        .attr("transform", "translate(15, 6)") // align text with boxes
    
    lineLegend.append("rect")
        .attr("fill", d=> colorWithKeys[d])
        .attr("width", 12).attr("height", 5)
    resize()
}




function resize() {
    width = parseInt(d3.select(".chartSvg").style('width'), 10);
    width = width - margin.left - margin.right;
//    d3.select(".textSvg").attr("width", width)

//    console.log("Resize width :" + width);
    x.range([0, width]);
    y.range([height, 0]);
    svg.selectAll(".line").attr("d", function(d) { return line(d.values)});

    svg.selectAll(".dot.GPM")
        .attr("cx", function(d) {return x(d.season);})
        .attr("cy", function(d) {return y(d.value);})
    svg.selectAll(".dot.OPM")
        .attr("cx", function(d) {return x(d.season);})
        .attr("cy", function(d) {return y(d.value);})
    svg.selectAll(".dot.PROM")
        .attr("cx", function(d) {return x(d.season);})
        .attr("cy", function(d) {return y(d.value);})
    
    svg.select("g.x.axis").call(xAxis.ticks(width / 70))
        .selectAll("text")
        .attr("transform", "translate(0, 10)");
//    svg.select("g.x.axis").call(xAxis);
    svg.select("g.y.axis").call(yAxis.ticks(6).tickSize(width));
    
}











