
var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 30},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top +")");

var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) {return x(d.date);})
    .y(function(d) {return y(d.temperature);});
var theData = undefined;
d3.tsv("data.tsv", type, function(error, data) {
      if (error) throw error;

  // Construct new data structure
  // array of arrays
  // 1st level of arrays are based on City
  //   - so 3 arrays at this level
  // 2nd level of arrays are based on date and temp for each city
  //   - so 366 arrays at this level per city
  var cities = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, temperature: d[id]};
      })
    };
  });

  // Using the initial data figure out the min / max dates
  x.domain(d3.extent(data, function(d) { return d.date; }));

  // Using the constructed cities data figure out the min / max temperatures
  // Note the nested d3.min's
  //   - for each city figure out the min temp
  //   - then figure out the min temp from the city's min temp
  // Note the nested d3.max's
  //   - for each city figure out the max temp
  //   - then figure out the max temp from the city's max temp
  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);
    
    // Using the constructed cities data get the domain from the City id
  // We get ["New York", "San Francisco", "Austin"]
    z.domain(cities.map(function(c) { return c.id;}))
    
})








































