// URL: https://beta.observablehq.com/@mbostock/d3-line-chart
// Title: D3 Line Chart
// Author: Mike Bostock (@mbostock)
// Version: 161
// Runtime version: 1

const m0 = {
  id: "35e84dc078248e17@161",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# D3 Line Chart

AAPL stock price. Data: Yahoo Finance`
)})
    },
    {
      name: "chart",
      inputs: ["d3","DOM","width","height","xAxis","yAxis","data","line"],
      value: (function(d3,DOM,width,height,xAxis,yAxis,data,line)
{
  const svg = d3.select(DOM.svg(width, height));

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);
  
  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  
  return svg.node();
}
)
    },
    {
      name: "height",
      value: (function(){return(
500
)})
    },
    {
      name: "margin",
      value: (function(){return(
{top: 20, right: 30, bottom: 30, left: 40}
)})
    },
    {
      name: "x",
      inputs: ["d3","data","margin","width"],
      value: (function(d3,data,margin,width){return(
d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
)})
    },
    {
      name: "y",
      inputs: ["d3","data","height","margin"],
      value: (function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
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
      inputs: ["d3","x","y"],
      value: (function(d3,x,y){return(
d3.line()
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y(d => y(d.value))
)})
    },
    {
      name: "data",
      inputs: ["require"],
      value: (async function(require){return(
Object.assign(
  (await require("@observablehq/aapl")).map(({date, close}) => ({date, value: close})),
  {y: "$ Close"}
)
)})
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
  id: "35e84dc078248e17@161",
  modules: [m0]
};

export default notebook;
