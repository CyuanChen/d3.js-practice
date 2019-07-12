var financialStatementMargin = {top: 30, right: 50, bottom: 80, left: 20},
    financialStatementWidth = parseInt(d3.select("#financialStatement").style('width'), 10) - financialStatementMargin.left - financialStatementMargin.right,
    financialStatementHeight = 300 - financialStatementMargin.top - financialStatementMargin.bottom;

// 設定文字區域
var financialStatementTextSvg = d3.select("#financialStatement")
        .append("svg")
        .attr("class", "financialStatementTextSvg")
        .attr("width", financialStatementWidth + financialStatementMargin.left + financialStatementMargin.right)
        .attr("height", 100)
        .append("g")
        .attr("transform", "translate(" + financialStatementMargin.left + "," + financialStatementMargin.top + ")");

//設定畫圖區域
var financialStatementSvg = d3.select("#financialStatement")
        .append("svg")
        .attr("class", "financialStatementChartSvg")
        .attr("width", financialStatementWidth + financialStatementMargin.left + financialStatementMargin.right)
        .attr("height", 300)
        .attr("pointer-events", "all")
        .append("g")
        .attr("transform", "translate(" + financialStatementMargin.left + "," + financialStatementMargin.top + ")");



//var g = financialStatementSvg.append("g").attr("transform", "translate(" + financialStatementMargin.left + "," + financialStatementMargin.top +")");

var financialStatementX = d3.scaleLinear().range([0, financialStatementWidth]);
var financialStatementY = d3.scaleLinear().range([financialStatementHeight, 0]);
var financialStatementZ = d3.scaleOrdinal(d3.schemeCategory10);

var financialStatementXAxis = d3.axisBottom(financialStatementX);
var financialStatementYAxis = d3.axisRight(financialStatementY);

var financialStatementLine = d3.line()
    .x(function(d) {return financialStatementX(d.season);})
    .y(function(d) {return financialStatementY(d.value);})
var firstSeason;
var legendKeys = ["毛利率", "營業利益率", "稅後純益率"]
var colorWithKeys = { 毛利率: "steelblue" , 營業利益率: "green", 稅後純益率: "red"}
var colors = ["steelblue", "green", "red"];
var jsonArray = [];
var lineData;

financialStatementLoadJSON("https://cors-anywhere.herokuapp.com/https://raw.githubusercontent.com/CyuanChen/d3.js-practice/master/MultiLine%20Chart/1102Data.json")

window.addEventListener('resize', financialStatementResize );

function financialStatementLoadJSON(file) {
    financialStatementSvg.selectAll("*").remove(); // 切換不同資料需要重新畫圖，因此需要先清除原先的圖案
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
    financialStatementDraw(newData);
})
}

var GPMData, OPMData, PROMData;
var drawFirstTime = true;
var xAxisArray = [];

function financialStatementDraw(data) {
    financialStatementX.domain([1, 20]);
    console.log(data);
    var yMin = d3.min(jsonArray, function(d){return d});
    var yMax = d3.max(jsonArray, function(d){return d});
    console.log((Math.floor(yMin / 10) - 1) * 10  + ", " + (Math.ceil(yMax / 10) + 1) * 10);
    
    financialStatementY.domain([(Math.floor(yMin / 10) - 1) * 10, (Math.ceil(yMax / 10) + 1) * 10]);
    financialStatementZ.domain(data.map(function(d) {return d.id;}))
    
    financialStatementSvg.append("g")
        .attr("class", "y axis financialStatement");
    financialStatementSvg.append("g")
        .attr("class", "x axis financialStatement")
        .attr("transform", "translate(0," + financialStatementHeight + ")");
    
    var year = Math.floor(firstSeason/ 100);
    var a = firstSeason % 4 - 1;
    
    financialStatementSvg.select("g.x.axis.financialStatement")
        .call(financialStatementXAxis.ticks(20)
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
    
    financialStatementSvg.select("g.y.axis.financialStatement")
    .call(financialStatementYAxis.ticks(6).tickSize(financialStatementWidth))
    .selectAll("text")
    .attr("transform", "translate(10,0)")
    
    financialStatementSvg.attr("class", "y axis.financialStatement")
            .append("text")
            .attr("transform", "translate(" + (financialStatementWidth + 20) + ",0)")
            .attr("x", 0)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text("(%)");
    
    
    GPMData = data[0].values;
    OPMData = data[1].values;
    PROMData = data[2].values;
    // 針對y軸做虛線
    financialStatementSvg.select(".y.axis.financialStatement")
        .selectAll(".tick:not(:first-of-type) line")
        .attr("stroke", "#777")
        .attr("stroke-dasharray", "2.2");
    
    
    financialStatementSvg.selectAll(".category")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "category")
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke-width", 1.8)
        .attr("d", function(d) { 
        return financialStatementLine(d.values)})
        .style("stroke", function(d, i) {
        return colors[i];
        })
    

    financialStatementSvg.selectAll(".dot.GPM")
        .data(GPMData)
        .enter().append("circle")
        .attr("class", "dot GPM")
        .attr("r", 3.5)
        .attr("cx", function(d) {return financialStatementX(d.season);})
        .attr("cy", function(d) {return financialStatementY(d.value);})
        .attr("opacity", 1)

    financialStatementSvg.selectAll(".dot.OPM")
        .data(OPMData)
        .enter().append("circle")
        .attr("class", "dot OPM")
        .attr("r", 3.5)
        .attr("cx", function(d) {return financialStatementX(d.season);})
        .attr("cy", function(d) {return financialStatementY(d.value);})
        .attr("opacity", 1)

    financialStatementSvg.selectAll(".dot.PROM")
        .data(PROMData)
        .enter().append("circle")
        .attr("class", "dot PROM")
        .attr("r", 3.5)
        .attr("cx", function(d) {return financialStatementX(d.season);})
        .attr("cy", function(d) {return financialStatementY(d.value);})
        .attr("opacity", 1)
    
    
    var lineLegend = financialStatementTextSvg.selectAll(".lineLegend")
        .data(legendKeys)
        .enter().append("g")
        .attr("class", "lineLegend")
        .attr("transform", function(d, i) {
            return "translate(" + (0) + "," + (i*25) + ")";
        })
    lineLegend.append("text")
        .text(function(d) { return d;})
        .attr("transform", "translate(15, 6)") // align text with boxes
    
    lineLegend.append("rect")
        .attr("fill", d=> colorWithKeys[d])
        .attr("width", 12).attr("height", 5)
    financialStatementResize()
}




function financialStatementResize() {
    var originFinancialStatementWidth = parseInt(d3.select("#financialStatement").style('width'), 10);
    financialStatementWidth = originFinancialStatementWidth - financialStatementMargin.left - financialStatementMargin.right;
//    d3.select(".textSvg").attr("financialStatementWidth", financialStatementWidth)
    d3.select(".financialStatementTextSvg").attr("width", originFinancialStatementWidth);
    d3.select(".financialStatementChartSvg").attr("width", originFinancialStatementWidth);
    // d3.select(".financialChartSvg").attr("width", originFinancialStatementWidth);
    // d3.select(".financialStatementTextSvg").attr("width", originFinancialStatementWidth);
//    console.log("Resize financialStatementWidth :" + financialStatementWidth);
    financialStatementX.range([0, financialStatementWidth]);
    financialStatementY.range([financialStatementHeight, 0]);
    financialStatementSvg.selectAll(".line").attr("d", function(d) { return financialStatementLine(d.values)});

    financialStatementSvg.selectAll(".dot.GPM")
        .attr("cx", function(d) {return financialStatementX(d.season);})
        .attr("cy", function(d) {return financialStatementY(d.value);})
    financialStatementSvg.selectAll(".dot.OPM")
        .attr("cx", function(d) {return financialStatementX(d.season);})
        .attr("cy", function(d) {return financialStatementY(d.value);})
    financialStatementSvg.selectAll(".dot.PROM")
        .attr("cx", function(d) {return financialStatementX(d.season);})
        .attr("cy", function(d) {return financialStatementY(d.value);})
    
    financialStatementSvg.select("g.x.axis.financialStatement").call(financialStatementXAxis.ticks(financialStatementWidth / 50))
        .selectAll("text")
        .attr("transform", "translate(0, 10)");
    financialStatementSvg.select("g.y.axis.financialStatement").call(financialStatementYAxis.ticks(6).tickSize(financialStatementWidth));
    
}











