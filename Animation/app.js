var svg = d3.selectAll("body")
    .append("svg")
    .attr("width", 700)
    .attr("height", 700);
var rect = svg.append("rect")
    .attr("stroke", "black");
rectRepeat();
function rectRepeat() {
    rect
    .attr("stroke-width", 3)
    .attr("fill", "none")
    .attr("width", 100)
    .attr("height", 100)
    .attr("transform", "translate(10,10)")
    .transition()
    .duration(1000)
    .attr("transform", "translate(70,50)")
    .on("end", rectRepeat);    
}


var chart = svg.append("rect")
    .attr("fill", "steelblue");
repeat();
function repeat() {
    chart
    .attr("x", 200)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 30)
    .transition()
    .ease(d3.easeBounce)
    .duration(1000)
    .attr("width", 400)
    .on("end", repeat);
}
    
var startWidth = 100;
var endWidth = 300;

var rect2 = svg.append("rect")
    .attr("class","mark")
    .attr("fill", "steelblue")
    .attr("x", 10)
    .attr("y", 300)
    .attr("width", startWidth)
    .attr("height", 30);
    
var text = svg.append("text")
    .attr("fill", "white")
    .attr("x", startWidth)
    .attr("y", 300)
    .attr("dy", "1.2em")
    .attr("text-anchor", "end")
    .text(startWidth);



d3.transition()
	.duration(500)
  .tween("move", function(){
  	return function(t){
        var interpolate = d3.interpolate(startWidth, endWidth);
    	var num = interpolate(t);
//            startWidth + t * (endWidth - startWidth)
    
    	d3.select(".mark")
      	.attr("width", num);
        
      d3.select("text")
      	.attr("x", num)
      	.text(Math.floor(num));
    }
  })


