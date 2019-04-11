var margin = {top: 20, right: 80, bottom: 80, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// 設定時間格式
var parseDate = d3.timeParse("%Y%m%d");
var monthDate = d3.timeParse("%Y%m");

//設定畫圖區域
var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("pointer-events", "all")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top +")");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .x(function(d) {return x(d.season);})
    .y(function(d) {return y(d.value);})
var firstSeason;

d3.json("data.json", function(error, data) {
    console.log(data);
    var jsonData = data["Data"];
    console.log(jsonData);
//    var newData = jsonData.map(function(d) {
//        return {
//            season: +d[0],
//            GPM: +d[55],
//            OPM: +d[59],
//            PROM: +d[65]
//        }
//    }).reverse();
    var dataArr = [55,59,65]
    var newData = dataArr.map(function(id) {
        var i = 21
        return {
            id: id,
            values: jsonData.map(function(d) {
                i -= 1
                return { season: i, value: +d[id]}
            }).reverse()
        }
    })
     firstSeason = +jsonData.reverse()[0][0]
    console.log(firstSeason);
        
        
//        jsonData.map(function(d) { return {season: +d[0], value: +d[55];} }),
//        jsonData.map(function(d) { return {season: +d[0], value: +d[59];} }),
//        jsonData.map(function(d) { return { season: +d[0], value: +d[65];}})
//    var test = [ {}, {data:2, value:3}]
//    console.log("data: " + newData + "count" + newData.length);
//    newData.map(function(d) { console.log(d.season)})
    draw(newData);
})
function draw(data) {
    x.domain([1, 20])
    
    y.domain([-20.0, 40.0]);
    z.domain(data.map(function(d) {return d.id;}))
    data.map(function(d){ console.log(d.id)})
    
    
    var i = 0;
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(20)
              .tickFormat(function(d) { 
            var a = i % 4;
            var sum = firstSeason + (100 * Math.floor(i / 4)) + a;
            i += 1;
            return sum;
        })
    );
    
    g.append("g")
        .attr("class", "y axis")
//        .attr("transform", "translate()")
        .call(d3.axisRight(y).ticks(3).tickSize(width));
    var GPMData = data[0].values;
    console.log(GPMData)
    

    g.append("path")
        .datum(GPMData)
        .attr("fill", "none")
        .attr("class", "line GPM")
        .attr("stroke-width", 1.8)
//        .attr("transform", "translate(" + (xScale.bandwidth() / 2) + ",0)")
        .attr("d", line);
    g.selectAll(".dot.GPM")
        .data(GPMData)
        .enter().append("circle")
        .attr("class", "dot GPM")
        .attr("r", 3.5)
        .attr("cx", function(d) {return x(d.season);})
        .attr("cy", function(d) {return y(d.value);})
        .attr("opacity", 1)
        
    
    g.append("path")
        .datum(data[1].values)
        .attr("fill", "none")
        .attr("class", "line OPM")
        .attr("stroke-width", 2.5)
        .attr("d", line);
    g.selectAll(".dot.OPM")
        .data(data[1].values)
        .enter().append("circle")
        .attr("class", "dot OPM")
        .attr("r", 3.5)
        .attr("cx", function(d) {return x(d.season);})
        .attr("cy", function(d) {return y(d.value);})
        .attr("opacity", 1)
    
    
    g.append("path")
        .datum(data[2].values)
        .attr("fill", "none")
        .attr("class", "line PROM")
        .attr("stroke", "red")
        .attr("stroke-width", 2.5)
//        .attr("transform", "translate(" + (xScale.bandwidth() / 2) + ",0)")
        .attr("d", line);
    
    g.selectAll(".dot.PROM")
        .data(data[2].values)
        .enter().append("circle")
        .attr("class", "dot PROM")
        .attr("r", 3.5)
        .attr("cx", function(d) {return x(d.season);})
        .attr("cy", function(d) {return y(d.value);})
        .attr("opacity", 1)
}















