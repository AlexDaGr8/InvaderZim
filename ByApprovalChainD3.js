var data = json.Data;
var pc = {};

      var barchart = function(bd) {

          var w = 800, h = 300;

        var y = d3.scale.ordinal()
            .domain(d3.range(data.length/2))
            .rangeBands([h,0], 0.25);

        var x = d3.scale.linear()
            .domain(d3.extent(bd, function(d) { return d[1]; }))
            .range([w*0.03,(w/2)*0.5]);

        var btnclick = [false, false]
          d3.select("#apprvchart").append("div")
            .classed("btn btn-primary", true)
            .style({
                position: "absolute",
                top: "64px",
                left: "15px"
            })
            .on("click", function (d) {
                if (btnclick[0]) {
                    bd.sort(function (a, b) { return d3.descending(a[1], b[1]); });
                    btnclick[0] = false;
                }
                else {
                    bd.sort(function (a, b) { return d3.descending(b[1], a[1]); })
                    btnclick[0] = true;
                }
                destroy();
                create(bd);
                for (var i = 0; i < bd.length; i++) {
                    if (bd[i][0] == "Operations (TSG)")
                        pc.update(bd[i][2]);
                }
          })
          .text("Sort By Value");



          d3.select("#apprvchart").append("div")
             .classed("btn btn-primary", true)
            .style({
                position: "absolute",
                top: "64px",
                left: "140px"
            })
            .on("click", function (d) {
                if (btnclick[1]) {
                    bd.sort(function (a, b) { return d3.descending(a[0], b[0]); });
                    btnclick[1] = false;
                }
                else {
                    bd.sort(function (a, b) { return d3.descending(b[0], a[0]); })
                    btnclick[1] = true;
                }
                destroy();
                create(bd);
                for (var i = 0; i < bd.length; i++) {
                    if (bd[i][0] == "Operations (TSG)")
                        pc.update(bd[i][2]);
                }
            })
            .text("Sort By Name");

          var svg = d3.select("#apprvchart").append("svg")
            .attr({"width": w, "height": h})
            .append("g")
            .classed("g-container", true)
            .attr("transform", "translate("+160+","+75+")");

        function destroy() {
          var g = svg.selectAll("g")
            .data([]).exit().remove();
        }

        function create(data) {

            var g = svg.selectAll("g")
                .data(data)
              .enter().append("g");

            var namesGreater = [];
            var namesLess = [];

            data.forEach(function (d, i) {
                if (i >= data.length / 2) {
                    namesGreater.push(d[0]);
                }
                else {
                    namesLess.push(d[0]);
                }
            })

            var gAxis = d3.scale.ordinal()
                .domain(namesGreater.reverse())
                .rangeBands([h, 0], 0.5);

            var lAxis = d3.scale.ordinal()
                .domain(namesLess.reverse())
                .rangeBands([h, 0], 0.3);

            var yAxis1 = d3.svg.axis()
                .scale(gAxis)
                .orient("left");

            var yAxis2 = d3.svg.axis()
                .scale(lAxis)
                .orient("left");

            var axis1 = svg.append("g")
                .attr("class", "y1 axis")
                .attr("transform", "translate(0,-75)")
                .call(yAxis2)
              .selectAll(".tick text")
                .call(wrap, 150);

            var axis1 = svg.append("g")
                .attr("class", "y2 axis")
                .attr("transform", "translate(" + w / 2 + ",-75)")
                .call(yAxis1)
              .selectAll(".tick text")
                .call(wrap, 150);

            var bars = g.append("rect")
                .attr({
                  x: function(d,i) {
                    if (i>=data.length/2) return (w/2);
                  },
                  y: function(d,i) {
                      var yvar = 0, gvar = 0;
                    if (i>=data.length/2)  {
                        gvar = gAxis(namesGreater[i - Math.ceil(data.length / 2)]);
                        return (h - 100) - gvar;
                  }
                    else {
                      yvar = y(i);
                      return (h-100) - y(i);}
                  },
                  width: 0,
                  height: y.rangeBand(),
                })
                .style({
                    fill: function (d) {
                        if (d[0] == "Operations (TSG)") {
                            pc.parentName = d[0];
                            return "#FCE108";
                        }
                        else return "#006FB9";
                    },
                  transition: "fill .01s ease",
                })
                .transition().duration(500)
                .attr("width", function(d) { return x(d[1]); });

            var valueText = g.append("text")
                .classed("value", true)
                .text(function(d) { return d[1]; })
                .attr({
                  x: function(d,i) {
                    if (i>=data.length/2) return x(d[1]) + (w/2) + 5;
                    else return x(d[1]) + 5;
                  },
                  y: function(d,i) {
                    var yvar = 0, gvar = 0;
                    if (i>=data.length/2)  {
                        gvar = gAxis(namesGreater[i - Math.ceil(data.length / 2)]);
                      return (h-100) - gvar + 20; }
                    else {
                      yvar = y(i);
                      return (h-100) - y(i) + 20;}
                  },
                });

            var click = "Operations (TSG)";
            g.on("mouseover", function (d, i) {
                if (d[0] != click) {
                    d3.select(this).select("rect").style("fill", "#0096D7");
                }
                else {
                    d3.select(this).select("rect").style("fill", "#FCE108");
                }
            }).on("mouseout", function(d,i) {
                if (d[0] != click) {
                    d3.select(this).select("rect").style("fill", "#006FB9");
                }
                else {
                    d3.select(this).select("rect").style("fill", "#FCE108");
                }
            }).on("click", function (d, i) {
              pc.parentName = d[0];
              click = d[0];
              pc.update(d[2]);
              g.selectAll("rect").style("fill", "#006FB9");
              d3.select(this).select("rect").style("fill", "#FCE108");
            });
          }

          create(bd);

      }

      var piechart = function(pd) {
        var pData = pd.map(function(d) { return [d.Name, d.Value]; });

        var w = 400;

        var color = d3.scale.ordinal()
          .domain([0,50])
          .range(["#219673", "", "#e91e63", "#9c27b0", "#a2ab99", "#3f51b5",
                  "#f44336", "#03a9f4", "#8bc34a", "#ffc1a7", "#4caf50",
                  "#412234", "#cddcf9", "#ffeb3b", "#009688", "#956095",
                  "#000040", "#795548", "#fe9e9e", "#0000bb", "#ff5722",
                  "#83805e", "#673ab7", "#9a5250", "#d2a060", "#5ffa71",
                  "#007482", "#304453", "#f7916d", "#d4639f", "#ff7800",
                  "#ea7af4", "#deb841", "#5fda4f", "#62ab37", "#bdd9bf",
                  "#b43e8f", "#419d78", "#ff8c42", "#a6f4dc", "#2e4052",
                  "#6f5e53", "#6200b3", "#f9c784", "#85ff9e", "#ffc857",
                  "#3b0086", "#bbbe64", "#4e598c", "#944654", "#00dcd4"]);

        var pieScale = d3.scale.linear()
          .domain(d3.extent(pData, function(d) { return d[1]; }))
          .range([10, 100]);

        var arc = d3.svg.arc()
          .outerRadius((w/2) - 30)
          .innerRadius(50);

        var arcclick = d3.svg.arc()
          .outerRadius((w / 2) - 20)
          .innerRadius(110);

        var pie = d3.layout.pie()
          .value(function(d) { return pieScale(d[1]); })
          .padAngle(0.01);

        var svg = d3.select("#apprvchart").append("svg")
          .attr({width: w, height: w})
          .append("g")
          .attr("transform", "translate(" + (w / 2) + "," + ((w / 2) + 20) + ")");

        var g = svg.selectAll("g")
          .data(pie(pData))
          .enter().append("g");

        var circle = g.append("circle");

        var circText = g.append("text");

        var circValue = g.append("text");

        var slices = g.append("path");

        pc.update = function(data) {
            pData = data.map(function(d) { return [d.Name, d.Value, d.NameVal]; });

            var colors = [];
            for(var i=0;i<50;i++) colors.push({"i": i,"color":color(i)});

            var colorSVG = d3.select("#colorGrid").append("svg")



            var categroies = [];
            pData.forEach(function(d) {
                categroies.push(d[0]);
            })

          pieScale.domain(d3.extent(pData, function (d) { return d[1]; }))
          .range([20, 200]);

          g.data(pie([])).exit().remove();
          g = svg.selectAll("g")
            .data(pie(pData))
            .enter().append("g");

          slices = g.append("path")
              .attr("fill", function(d) {
                 return color(d.data[2]); })
              .transition().duration(500)
              .attrTween('d', function(d) {
                var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                return function(t) {
                  d.endAngle = i(t);
                  return arc(d);
                }
              });

          circle = g.append("circle")
            .attr("id", "circle")
            .attr("r", 95)
            .attr("fill", "#fff")

          circText = g.append("text")
              .text(null)
              .attr("id", "circleText");

          circValue = g.append("text")
              .text(null)
              .attr("id", "circleValue");

          hover();
        }

        function hover() {
            var click = [];
            g.on("mouseover", function (d, i) {
              circText.text(d.data[0])
                  .attr({
                      "x": 1,
                      "y": 0,
                      "dy": 1,
                      "text-anchor": "middle",
                      "font-size": "16px"
                  })
                  .call(wrap, 150);

                circValue.text(d.data[1])
                    .attr({
                        "x": 1,
                        "y": -30,
                        "dy": 1,
                        "text-anchor": "middle",
                        "font-size": "30px",
                        "font-weight": "bolder"
                    })

                d3.select(this).select("path")
                    .style("opacity", 0.7);

            })
            .on("mouseout", function (d, i) {
                console.log(+click[1] > 0);
                if (+click[1] > 0) {
                    circText.text(click[0])
                        .attr({
                            "x": 1,
                            "y": 0,
                            "dy": 1,
                            "text-anchor": "middle",
                            "font-size": "16px"
                        })
                        .call(wrap, 150);

                    circValue.text(click[1])
                        .attr({
                            "x": 1,
                            "y": -30,
                            "dy": 1,
                            "text-anchor": "middle",
                            "font-size": "30px",
                            "font-weight": "bolder"
                        })
                }
                else {
                    circText.text("");
                    circValue.text("");
                }


                d3.selectAll("path")
                    .style("opacity", 1);

            })
              .on("click", function (d, i) {
                  click[0] = d.data[0];
                  click[1] = d.data[1];

                  circText.text(click[0])
                  .attr({
                      "x": 1,
                      "y": 0,
                      "dy": 1,
                      "text-anchor": "middle",
                      "font-size": "16px"
                  })
                  .call(wrap, 150);

                  circValue.text(click[1])
                      .attr({
                          "x": 1,
                          "y": -30,
                          "dy": 1,
                          "text-anchor": "middle",
                          "font-size": "30px",
                          "font-weight": "bolder"
                      })
                  g.selectAll("path")
                    .transition()
                    .duration(200)
                    .attr("d", arc);

                  d3.select(this).select("path")
                    .transition()
                    .duration(200)
                    .attr("d", arcclick);

                  getOpenTids(d.data[0], pc.parentName);
              });
        }
        hover();
      }

      var barD = data.map(function (d) { return [d.Name, d.Value, d.Children]; });
      barD.sort(function (a, b) { return d3.descending(a[1], b[1]); });

      barchart(barD);
      piechart([]);
      for (var i = 0; i < barD.length; i++) {
          if (barD[i][0] == "Operations (TSG)")
              pc.update(barD[i][2]);
      }


      function wrap(text, width) {
          text.each(function () {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              textLength = text.text(words).node().getComputedTextLength(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.15, // ems
              y = text.attr("y"),
              x = text.attr("x")
              dy = -0.3,
              tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
              if (textLength > width) {
                  while (word = words.pop()) {
                      line.push(word);
                      tspan.text(line.join(" "));
                      if (tspan.node().getComputedTextLength() > width) {
                          line.pop();
                          tspan.text(line.join(" "));
                          line = [word];
                          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                      }
                  }
              }
              else {
                  while (word = words.pop()) {
                      line.push(word);
                      tspan.text(line.join(" ")).attr("dy", "0.3em");
                  }
              }
          });
      }
