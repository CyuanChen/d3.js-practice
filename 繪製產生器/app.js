var a = d3.rgb("blue");
var b = d3.rgb("green");

var interpolate = d3.interpolate(a,b);
console.log(interpolate(0));
console.log(interpolate(1));
console.log(interpolate(0.5));
var svg = d3.select("body").append("svg")
    .attr("width", 400)
    .attr("height", 300);

var lines = [[80,80], [200,100], [200,200],[100,200]];
var linePath = d3.line();
svg.append("path")
    .attr("d", linePath(lines))
    .attr("stroke", "black")
    .attr("fill", "none")

;
var lines2 = [80,120,160,200,240,280,320];
var linePath = d3.line()
    .x(function(d) {
        return d;
    })
    .y(function(d, i) {
        return i % 2 == 0 ? 40 : 120;
    });
var linePath2 = d3.line();
svg.append("path")
    .attr("d", linePath(lines2))
    .attr("stroke", "green")
    .attr("fill", "none");
var height = 200

var dataSet = [80,120,140,00,60,90];
var areaPath = d3.area()
    .x(function(d,i) {return 50 + i * 80})
    .y0(function(d,i) {return height/2})
    .y1(function(d,i){ return height / 2 - d});





var svg2 = d3.select("body").append("svg")
    .attr("width", 400)
    .attr("height", 300);

var area = svg2.append("path")
    .attr("d", areaPath(dataSet))
    .attr("stroke", "black");
var areaText = svg2.append("text")
    .attr("fill", "red")
    .attr("display", "none");

area.on("mousemove", function() {
    var x = d3.mouse(this)[0];
    var y = d3.mouse(this)[1];
    
    areaText.attr("display", null) //取消隱藏
        .attr("x", x + 20)
        .attr("y", y)
        .text("[" + x + ", " + y + "]");
})
    .on("mouseout", function(){
    areaText.attr("display", "none");
})

;



var svg3 = d3.select("body").append("svg")
    .attr("width", 400)
    .attr("height", 800);


//var dataSet2 = [{ startAngle: 0, endAngle: Math.PI * 0.6},
//       {
//   startAngle: Math.PI * 0.6, endAngle: Math.PI * 1}, {startAngle: Math.PI , endAngle: Math.PI * 1.7},{startAngle: Math.PI *1.7, endAngle: Math.PI * 2}];
//var arcPath = d3.arc()
//    .innerRadius(80)
//    .outerRadius(100);

//svg3.append("path")
//    .data(dataSet2)
//    .enter()
//    .attr("d", function(d) {return arcPath(d);})
//    .attr("transform", "translate(250,250)")
//    .attr("stroke", "black")
//    .attr("stroke-width", "3px")
//    .attr("fill", "yellow");


var colorArr = ["#587791","#81a7a6","#efc57f","#de6868"]
  
svg3.selectAll("path")
  .data(dataSet2)
  .enter()
  .append("path")
  .attr("d", function(d){ return arcPath(d) })
  .attr("transform", "translate(255,255)")
  .attr("stroke", "black")
  .attr("stroke-width", "1px")
  .attr("fill", function(d,i){
      return colorArr[i]
  });

svg3.selectAll("text")
    .data(dataSet2)
    .enter()
    .append("text")
    .attr("transform", function(d) {
    return "translate(250,250)" + "translate(" + arcPath.centroid(d) + ")"
    })
    .attr("text-anchor", "middle")
    .attr("fill", "whites")
    .attr("font-size", "18px")
    .text(function(d) {
    return Math.floor((d.endAngle - d.startAngle) * 180 / Math.PI) + "°";
});

var test = d3.select("#test")
    .on("click", function() {
        d3.select(this).text("測試按鈕");
    })

var svg4 = d3.select("body").append("svg")
	.attr("width", 500)
  .attr("height", 500)
  
var drag = d3.drag()
//	.origin(function(d,i){
//  	return {x: d.cx, y: d.cy}
//  })
  .on("start", function(d){
  	console.log("拖曳開始")
  })
  .on("end", function(d){
  	console.log("拖曳結束")
  })
  .on("drag", function(d){
  	d3.select(this)
    	.attr("cx", d.cx = d3.event.x)
      .attr("cy", d.cy = d3.event.y)
  })  
  
  
var circles = [{cx: 150, cy: 200, r: 30},
	{cx: 250, cy: 200, r: 30}]
  
svg4.selectAll("circle")
	.data(circles)
  .enter()
  .append("circle")
  .attr("cx", function(d){ return d.cx })
  .attr("cy", function(d){ return d.cy })
  .attr("r", function(d){ return d.r })
  .attr("fill", "steelblue")
  .call(drag)




























