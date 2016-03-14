if(!d3.chart) d3.chart = {};

d3.chart.barChart = function(group, data, w) {

  var width = d3.scale.linear()
  .range([0,w-10])
  .domain([0,d3.max(data, function(d) { return d.Value; })]);

  var color = d3.scale.category20();

  var g = group.selectAll("g")
  .data(data)
  .enter().append("g")
  .style("transform", function(d,i) {
  	return "translate(30px, " + (i * 40 + 30) + "px)";
  })


  var rects = g.selectAll("rect")
  .data(function(d) { return d.Children; })
  .enter().append("rect");

  var rectX = [];
  rects.attr({
    x: 0,
    width: 0,
    fill: function(d,i) { return color(i); }
  })
  .transition().duration(1000)
  .attr({
    height: 30,
    width: function(d,i) { return width(d.Value); },
    x: function(d,i) {
      if (i===0) rectX = [];
      rectX.push(width(d.Value));
      var tots = 0;
      for(j=i;j>0;j--){
        if(i===0) tots = 0;
        else tots += rectX[i-j];
      }
      return tots;
    },
    y: 0,
    fill: function(d,i) { return color(i); }
  });

  rects.on("mouseover", function(){
    d3.select(this)
    .transition().duration(200)
    .attr({ height: 40, y: -5});
  }).on("mouseout", function(){
    d3.select(this)
    .transition().duration(200)
    .attr({ height: 30, y: 0});
  })

  var text = g.append("text")
  .text(function(d) { return d.Name; })
  .attr({ y: 23, x: -30, fill: '#f03' });
}
