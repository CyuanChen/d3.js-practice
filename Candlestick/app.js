var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

    var parseDate = d3.timeParse("%Y%m%d");

    var x = techan.scale.financetime()
            .range([0, width]);

    var y = d3.scaleLinear()
            .range([height, 0]);

    var yVolume = d3.scaleLinear()
            .range([y(0), y(0.2)]);

    var candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);

    var sma0 = techan.plot.sma()
            .xScale(x)
            .yScale(y);
    var sma1 = techan.plot.sma()
            .xScale(x)
            .yScale(y);
    var ema2 = techan.plot.ema()
            .xScale(x)
            .yScale(y);

    var volume = techan.plot.volume()
            .accessor(candlestick.accessor())
            .xScale(x)
            .yScale(yVolume);
    var xAxis = d3.axisBottom()
            .scale(x);

    var yAxis = d3.axisLeft()
            .scale(y);
    var volumeAxis = d3.axisRight(yVolume)
            .ticks(3)
            .tickFormat(d3.format(",.3s"));


    var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("data.json", function(error, data) {
        var accessor = candlestick.accessor();
        var jsonData = data["Data"];
        console.log(jsonData);
        data = 
            jsonData
//            .slice(0, 200)
            .map(function(d) {
            return {
                date: parseDate(d[0]),
                open: +d[3],
                high: +d[4],
                low: +d[5],
                close: +d[6],
                volume: +d[9]
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
        
        console.log(data);
        svg.append("g")
                .attr("class", "candlestick");

        svg.append("g")
                .attr("class", "sma ma-0");
        svg.append("g")
                .attr("class", "sma ma-1");
        svg.append("g")
                .attr("class", "ema ma-2");
        svg.append("g")
                .attr("class", "volume");
        svg.append("g")
                .attr("class", "volume axis");
        
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")");

        svg.append("g")
                .attr("class", "y axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");

        // Data to display initially
        draw(data.slice(0, data.length));
        // Only want this button to be active if the data has loaded
        d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
    });

    function draw(data) {
        x.domain(data.map(candlestick.accessor().d));
        y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
        yVolume.domain(techan.scale.plot.volume(data).domain());

        svg.selectAll("g.candlestick").datum(data).call(candlestick);
        
        svg.select("g.sma.ma-0").datum(techan.indicator.sma().period(10)(data)).call(sma0);
        svg.select("g.sma.ma-1").datum(techan.indicator.sma().period(20)(data)).call(sma0);
        svg.select("g.ema.ma-2").datum(techan.indicator.sma().period(50)(data)).call(sma0);
        svg.select("g.volume").datum(data).call(volume);
        
        svg.selectAll("g.x.axis").call(xAxis.tickFormat(d3.timeFormat("%m/%d")));
        svg.selectAll("g.y.axis").call(yAxis);
        svg.select("g.volume.axis").call(volumeAxis);
    }












