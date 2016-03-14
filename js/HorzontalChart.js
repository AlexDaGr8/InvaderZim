if(!d3.chart) d3.chart = {};

d3.chart.percentage = function() {
  var g;
  var data;
  var width = 500;
  var total = 0;
  var color = d3.scale.category10();
  var geez;
  var x = d3.scale.linear();

  var setup = function() {
      data.forEach(function(d) { total += d.Value; });
      x.domain([0,total])
        .range([0,width]);
      geez = g.selectAll("g")
      .data(data).enter().append("g");
  }

  var hover = function(gs) {
        gs.on("mouseover", function(d) {
              d3.select(this).select("rect")
              .transition().duration(203)
              .attr({ height: 40, y: 45 });
             })
            .on("mouseout", function(d) {
              d3.select(this).select("rect")
              .transition().duration(300)
              .attr({ height: 30, y: 50 });
             })
  }

  var rects = function(gs) {
      var rectX = [];
      var rects = geez.append("rect")
          .attr({
            height: 30,
            width: function(d) {console.log(x(d.Value)); return x(d.Value); },
            x: function(d,i) {
              if (i===0) rectX = [];
              rectX.push(x(d.Value));
              var tots = 0;
              for(j=i;j>0;j--){
                if(i===0) tots = 0;
                else tots += rectX[i-j];
              }
              return tots;
            },
            y: 50,
            fill: function(d,i) { return color(i); }
          });
  }

  var rectTrans = function(gs) {
      var rectX = [];
      var rects = geez.append("rect")
        .attr({ height: 0, width: 0,
          x: width/2, y: 0, rx: 0, ry: 0,
          fill: function(d,i) { return color(i); }
        })
        .transition().duration(1000)
          .delay(function(d,i) { return i * 200; })
          .attr({
            height: 30,
            width: function(d) { return x(d.Value); },
            x: function(d,i) {
              if (i===0) rectX = [];
              rectX.push(x(d.Value));
              var tots = 0;
              for(j=i;j>0;j--){
                if(i===0) tots = 0;
                else tots += rectX[i-j];
              }
              return tots;
            },
            y: 50
          });
  }

  var text = function(gs) {
        var wtotal = 0;
        var text = gs.append("text")
          .text(function(d) { return d.Value; })
          .attr({
            x: function(d,i) {
              wtotal += x(d.Value);
              return (wtotal - x(d.Value)) + x(d.Value)/2.8;
            }, y: 72, fill: "white"
          });
  }

    function chart(container) {
      g = container;
      update();
    }

    chart.destroy = destroy;
    function destroy(x) {
      width = x;
      g.selectAll("g").data([]).exit().remove();
      total = 0;
      update(true);
    }

  chart.update = update;
  function update(resize) {
    // setting up data and g's
    setup();
    // for the hover action
    hover(geez);
    // if the screen is resizing don't do transition in
    if (resize) rects(geez);
    else rectTrans(geez);
    // for the texts on on each piece
    text(geez);
  }

  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  };
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  };
  return chart;
};
