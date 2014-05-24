var sampleData = [{
  "x": 18,
  "y": 5,
    "z":4
}, {
  "x": 20,
  "y": 20,
    "z":10
}, {
  "x": 40,
  "y": 10,
    "z":12
}, {
  "x": 60,
  "y": 40,
    "z":18
}, {
  "x": 80,
  "y": 5,
    "z":10
}, {
  "x": 100,
  "y": 60,
    "z":18
}];

InitChart();

function InitChart()
{
        var vis = d3.select("#svgVisualize");
        var xRange = d3.scale.linear().range([40, 400]).domain([d3.min(sampleData, function (d) {
                            return 0;//return (d.x);
                        }),
                        d3.max(sampleData, function (d) {
                            return d.x;
                        })]);
        var yRange = d3.scale.linear().range([400, 40]).domain([d3.min(sampleData, function (d) {
                            return 0;//return d.y;
                        }),
                        d3.max(sampleData, function (d) {
                            return d.y;
                        })]);
        var xAxis = d3.svg.axis().scale(xRange);
        var yAxis = d3.svg.axis().scale(yRange).orient("left");
        vis.append("svg:g").call(xAxis).attr("transform", "translate(0,400)");
        vis.append("svg:g").call(yAxis).attr("transform", "translate(40,0)");
        var circles = vis.selectAll("circle").data(sampleData);
    circles
        .enter()
        .insert("circle")
        .attr("cx", function (d) { return xRange (d.x); })
        .attr("cy", function (d) { return yRange (d.y); })
        .attr("r", function(d) { return d.z; })
        .style("fill", "red");
}
    