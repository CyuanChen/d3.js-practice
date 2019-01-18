// URL: https://beta.observablehq.com/@mbostock/d3-multi-line-chart
// Title: D3 Multi-Line Chart
// Author: Mike Bostock (@mbostock)
// Version: 258
// Runtime version: 1

const m0 = {
  id: "86944e959995fdeb@258",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# D3 Multi-Line Chart

Data: [Bureau of Labor Statistics](https://www.bls.gov/)`
)})
    },
    {
      name: "chart",
      inputs: ["d3","DOM","width","height","xAxis","yAxis","data","line","hover"],
      value: (function(d3,DOM,width,height,xAxis,yAxis,data,line,hover)
{
  const svg = d3.select(DOM.svg(width, height));

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
    .selectAll("path")
    .data(data.series)
    .enter().append("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", d => line(d.values));

  svg.call(hover, path);

  return svg.node();
}
)
    },
    {
      name: "hover",
      inputs: ["d3","y","x","data"],
      value: (function(d3,y,x,data){return(
function hover(svg, path) {
  svg
      .style("position", "relative");
  
  if ("ontouchstart" in document) svg
      .style("-webkit-tap-highlight-color", "transparent")
      .on("touchmove", moved)
      .on("touchstart", entered)
      .on("touchend", left)
  else svg
      .on("mousemove", moved)
      .on("mouseenter", entered)
      .on("mouseleave", left);

  const dot = svg.append("g")
      .attr("display", "none");

  dot.append("circle")
      .attr("r", 2.5);

  dot.append("text")
      .style("font", "10px sans-serif")
      .attr("text-anchor", "middle")
      .attr("y", -8);

  function moved() {
    d3.event.preventDefault();
    const ym = y.invert(d3.event.layerY);
    const xm = x.invert(d3.event.layerX);
    const i1 = d3.bisectLeft(data.dates, xm, 1);
    const i0 = i1 - 1;
    const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
    const s = data.series.reduce((a, b) => Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b);
    path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
    dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
    dot.select("text").text(s.name);
  }

  function entered() {
    path.style("mix-blend-mode", null).attr("stroke", "#ddd");
    dot.attr("display", null);
  }

  function left() {
    path.style("mix-blend-mode", "multiply").attr("stroke", null);
    dot.attr("display", "none");
  }
}
)})
    },
    {
      name: "height",
      value: (function(){return(
600
)})
    },
    {
      name: "margin",
      value: (function(){return(
{top: 20, right: 20, bottom: 30, left: 40}
)})
    },
    {
      name: "x",
      inputs: ["d3","data","margin","width"],
      value: (function(d3,data,margin,width){return(
d3.scaleTime()
    .domain(d3.extent(data.dates))
    .range([margin.left, width - margin.right])
)})
    },
    {
      name: "y",
      inputs: ["d3","data","height","margin"],
      value: (function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
    .range([height - margin.bottom, margin.top])
)})
    },
    {
      name: "xAxis",
      inputs: ["height","margin","d3","x","width"],
      value: (function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
)})
    },
    {
      name: "yAxis",
      inputs: ["margin","d3","y","data"],
      value: (function(margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y))
)})
    },
    {
      name: "line",
      inputs: ["d3","x","data","y"],
      value: (function(d3,x,data,y){return(
d3.line()
    .defined(d => !isNaN(d))
    .x((d, i) => x(data.dates[i]))
    .y(d => y(d))
)})
    },
    {
      name: "data",
      inputs: ["d3"],
      value: (async function(d3)
{
  const data = await d3.tsv("https://gist.githubusercontent.com"
      + "/mbostock/8033015/raw"
      + "/01e8225d4a65aca6c759fe4b8c77179f446c5815/unemployment.tsv", (d, i, columns) => {
    return {
      name: d.name.replace(/, ([\w-]+).*/, " $1"),
      values: columns.slice(1).map(k => +d[k])
    };
  });
  return {
    y: "% Unemployment",
    series: data,
    dates: data.columns.slice(1).map(d3.timeParse("%Y-%m"))
  };
}
)
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3@5")
)})
    }
  ]
};

const notebook = {
  id: "86944e959995fdeb@258",
  modules: [m0]
};

export default notebook;
