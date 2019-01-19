var width = 400;
var height = 400;
var padding = { top: 50, right: 50, bottom: 50, left: 50};
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var dataSet = [
  {
    country: "china",
    gdp: [[2000,11920],[2001,13170],[2002,14550],[2003,16500],[2004,19440],[2005,22870],[2006,27930],[2007,35040],[2008,45470],[2009,51050],[2010,59490],[2011,73140],[2012,83860],[2013,103550]]
  },
  {
    country: "japan",
    gdp: [[2000,47310],[2001,41590],[2002,39800],[2003,43020],[2004,46550],[2005,45710],[2006,43560],[2007,43560],[2008,48490],[2009,50350],[2010,54950],[2011,59050],[2012,59370],[2013,48980]]
  }
];

var gdpMax = 0;
for (var i = 0; i< dataSet.length; i ++) {
    var currentGdp = d3.max(dataSet[i].gdp, function(d) { return d[1];});
    if (currentGdp > gdpMax) {
        gdpMax = currentGdp;
    }
}

var xScale = d3.scaleLinear()
    .domain([2000,2013])
    .range([0, width - padding.left - padding.right]);
var yScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([height - padding.top - padding.bottom, 0 ]);

var linePath = d3.line()
    .x(function(d) { return xScale(d[0]);})
    .y(function(d) { return yScale(d[1]);})
    .curve(d3.curveCardinal);
var colors = [d3.rgb(0,0,255), d3.rgb(0,255,0)];

svg.selectAll("path")
    .data(dataSet)
    .enter()
    .append("path")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .attr("d", function(d) {
    return linePath(d.gdp);
})
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", function(d, i) {
    return colors[i];
})



// -- 座標軸 --
var xAxis = d3.axisBottom()
	.scale(xScale)
  .ticks(5)
  .tickFormat(d3.format("d"));
  
var yAxis = d3.axisLeft()
	.scale(yScale);
  
svg.append("g")
	.attr("class","xAxis")
  .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
	.call(xAxis)
  
svg.append("g")
	.attr("class", "yAxis")
  .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
  .call(yAxis)

var symbol = d3.symbol()
    .size(100)
    .type("square");


svg.selectAll(".mark")
	.data(dataSet)
  .enter()
  .append("path")
  .attr("class","mark")
  .attr("d", symbol.type(d3.symbolCircle)
)
  .attr("transform", function(d,i){
  	return "translate(" + (padding.left + i*60) + ", " + (height - 10) + ")"
  })
  .attr("fill", function(d,i){ return colors[i]})
  
svg.selectAll(".markText")
	.data(dataSet)
  .enter()
  .append("text")
  .attr("class","markText")
  .attr("transform", function(d,i){
  	return "translate(" + (padding.left + 10 + i*60) + ", " + (height - 5) + ")"
  })
  .attr("font-size", 12)
  .text(function(d){
  	return d.country
  })












