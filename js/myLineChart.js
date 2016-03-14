if(!d3.chart) d3.chart = {};

d3.chart.gridLine = function() {
    var data, id, svg, lines, circles, line, x, y, text;
    var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 960 - margin.top - margin.bottom,
        height = 500 - margin.right - margin.left;
    function chart(group) {
        id = d3.select(group);
        width = parseInt(id.style('width'),10) - margin.top - margin.bottom;
        update();
    }
    
    function update() {
        id.select("svg").remove();
        svg = id.append("svg")
            .attr({
                 width: width + margin.right + margin.left, 
                 height: height + margin.top + margin.bottom
             })
            .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        x = d3.scale.ordinal()
            .rangePoints([0,width]);
            
        y = d3.scale.linear()
            .range([height,0]);
                
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            //.ticks(d3.time.weeks, 2)
            .tickFormat(function(d) {
               return d3.time.format("%m/%d")(new Date(d)); 
            })
            .tickSize(height)
            .tickPadding(15);
        
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickPadding(7);
            
        line = d3.svg.line()
            .interpolate("monotone")   
            .x(function(d) { return x(d.name); })
            .y(function(d) { return y(d.value); });
            
        x.domain(data.map(function(d) { return d.name; }));
        y.domain([d3.min(data, function(d) { return d.value; }), 20]);
        
        var x_axis = svg.append("g")
        .attr({ 
                class: "x axis",
            })
            .call(xAxis);
                
        var y_axis = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
            
        y_axis.append("text")
            .text("Some Words")
            .attr({ x: -height/2, y: -30 })
            .style({
                "transform": "rotate(-90deg)",
                "font-size": "20px"
                });
            
        lines = svg.append("path")
            .attr("class", "line")
            .attr("d", line(data));
            
        var totalLength = lines.node().getTotalLength();

        lines
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
            .duration(1500)
            .ease("linear")
            .attr("stroke-dashoffset", 0);    
        
            
        circles = svg.selectAll("circle")
            .data(data)
            .enter().append("circle");

        circles
            .attr({
                r: 0,
                cy: 0
            })
            .transition().duration(750)
            .attr({
                r: function(d) { return d.value + 5; },
                fill: "#bbb",
                stroke: "steelblue",
                "stroke-width": 3,
                cx: function(d) { return x(d.name); },
                cy: function(d) { return y(d.value); }
            });

        text = svg.selectAll(".label")
            .data(data);
        
        text.enter().append("text")
            .attr("y", 0)
            .transition().duration(750)
            .text(function (d) { return d.value; })
            .attr({
                x: function (d) { 
                    if (d.value >= 10) return x(d.name)-7; 
                    else return x(d.name) - 3.25; 
                },
                y: function (d) { return y(d.value) + 4; },
                fill: "black"
            })
            .style("font-weight", "bold");
    }
    
    chart.updateData = function(value) {
        if (!arguments.length) return data;
        data = value;
        
        lines.data([]).exit().remove();
        circles.data([]).exit().remove();
        text.data([]).exit().remove();
        
        line.x(function(d) { return x(d.name); })
            .y(function(d) { return y(d.value); });
        x.domain(data.map(function(d) { return d.name; }));
        y.domain([d3.min(data, function(d) { return d.value; }), 20]);
        
        lines = svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
            
        var totalLength = lines.node().getTotalLength();

        lines
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
            .duration(1500)
            .ease("linear")
            .attr("stroke-dashoffset", 0);
            
        circles = svg.selectAll("circle")
            .data(data);

        circles.enter().append("circle")
            .attr({ r: 0, cy: 0 })
            .transition().duration(700)
            .attr({
                r: function(d) { return d.value + 5; },
                fill: "#bbb",
                stroke: "steelblue",
                "stroke-width": 3,
                cx: function(d) { return x(d.name); },
                cy: function(d) { return y(d.value); }
            });

        text = svg.selectAll(".label")
            .data(data);
        
        text.enter().append("text")
            .attr("y", 0)
            .transition().duration(700)
            .attr({
                x: function (d) { 
                    if (d.value >= 10) return x(d.name)-7; 
                    else return x(d.name) - 3.25; 
                },
                y: function (d) { return y(d.value) + 4; },
                fill: "black"
            })
            .style("font-weight", "bold");
            
        text.text(function (d) { return d.value; });
            
        
        return chart;
    }
    
    chart.update = update;
    
    var resize = function () {
        width = parseInt(id.style('width'),10) - margin.top - margin.bottom;
        update();
    }
    
    d3.select(window).on("resize", resize);
    
    chart.data = function (value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    }
    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    }
    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    }
    chart.margin = function (value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    }
    
    return chart;
}