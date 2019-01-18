// URL: https://beta.observablehq.com/@mbostock/hello-alpha-vantage
// Title: Hello, Alpha Vantage!
// Author: Mike Bostock (@mbostock)
// Version: 48
// Runtime version: 1

const m0 = {
  id: "2d5e790670dfaa01@48",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Hello, Alpha Vantage!

Data: [Alpha Vantage](https://www.alphavantage.co/documentation/#daily)`
)})
    },
    {
      name: "viewof symbol",
      inputs: ["submit"],
      value: (function(submit){return(
submit({value: "MSFT", placeholder: "Enter a symbol."})
)})
    },
    {
      name: "symbol",
      inputs: ["Generators","viewof symbol"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["chart"],
      value: (function(chart){return(
chart
)})
    },
    {
      name: "query",
      inputs: ["symbol"],
      value: (function(symbol){return(
fetch(`https://www.alphavantage.co/query?apikey=VR967HR41TBASL27&function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(symbol)}`).then(response => response.json())
)})
    },
    {
      name: "data",
      inputs: ["query","parseDate","symbol"],
      value: (function(query,parseDate,symbol){return(
Object.assign(
  Object.entries(query["Time Series (Daily)"]).map(([date, o]) => ({
    date: parseDate(date),
    value: +o["4. close"]
  })).reverse(),
  {y: `$ ${symbol}`}
)
)})
    },
    {
      name: "parseDate",
      inputs: ["d3"],
      value: (function(d3){return(
d3.timeParse("%Y-%m-%d")
)})
    },
    {
      from: "2d5e790670dfaa01@48/6",
      name: "chart",
      remote: "chart"
    },
    {
      from: "@mbostock/more-deliberate-inputs",
      name: "submit",
      remote: "submit"
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

const m1 = {
  id: "2d5e790670dfaa01@48/6",
  variables: [
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
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3@5")
)})
    },
    {
      name: "height",
      value: (function(){return(
600
)})
    },
    {
      name: "xAxis",
      inputs: ["height","margin","d3","x","width"],
      value: (function(height,margin,d3,x,width){return(
g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
  .call(g => g.select(".domain").remove())
)})
    },
    {
      name: "yAxis",
      inputs: ["margin","d3","y","format","width"],
      value: (function(margin,d3,y,format,width){return(
g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y)
      .tickValues(d3.ticks(...y.domain(), 10))
      .tickFormat(format))
  .call(g => g.selectAll(".tick line").clone()
      .attr("stroke-opacity", d => d === 1 ? null : 0.2)
      .attr("x2", width - margin.left - margin.right))
  .call(g => g.select(".domain").remove())
)})
    },
    {
      from: "2d5e790670dfaa01@48",
      name: "data",
      remote: "data"
    },
    {
      name: "line",
      inputs: ["d3","x","y","base"],
      value: (function(d3,x,y,base){return(
d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value / base))
)})
    },
    {
      name: "margin",
      value: (function(){return(
{top: 20, right: 30, bottom: 30, left: 50}
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
      inputs: ["d3","data","base","height","margin"],
      value: (function(d3,data,base,height,margin){return(
d3.scaleLog()
    .domain([d3.min(data, d => d.value / base * 0.9), d3.max(data, d => d.value / base / 0.9)])
    .range([height - margin.bottom, margin.top])
)})
    },
    {
      name: "format",
      inputs: ["d3"],
      value: (function(d3)
{
  const f = d3.format("+.0%");
  return x => x === 1 ? "0%" : f(x - 1);
}
)
    },
    {
      name: "base",
      inputs: ["data"],
      value: (function(data){return(
data[0].value
)})
    }
  ]
};

const m2 = {
  id: "@mbostock/more-deliberate-inputs",
  variables: [
    {
      name: "submit",
      inputs: ["html"],
      value: (function(html){return(
function submit({value = "", placeholder = "Type here, then click submit."} = {}) {
  const form = html`<form>
  <input name="text">
  <button type=submit>Submit</button>
</form>`;
  form.text.value = form.value = value;
  form.text.placeholder = placeholder;
  form.text.addEventListener("input", event => event.stopPropagation());
  form.addEventListener("submit", event => {
    form.value = form.text.value;
    form.dispatchEvent(new CustomEvent("input"));
    event.preventDefault();
  });
  return form;
}
)})
    }
  ]
};

const notebook = {
  id: "2d5e790670dfaa01@48",
  modules: [m0,m1,m2]
};

//export default notebook;
