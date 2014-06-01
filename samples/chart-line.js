var lineChart = function() {
  var margin = {top: 50, right: 50, bottom: 50, left: 50};
  var width = 400;
  var height = 300;
  var x = d3.time.scale();
  var y = d3.scale.linear().range([height, 0]);
  var xAxis = d3.svg.axis()
      .orient("bottom")
      .ticks(d3.time.year, 1)
      .tickFormat(d3.time.format("%Y"));
  var yAxis = d3.svg.axis()
      .orient("left");
  var key = null;
  var clipPath = null;
  var transitionDuration = 250;
  var animationStepDuration = 1000;
  //function for drawing the line
  var line = d3.svg.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.value); });

  function init(data) {
    var flattenedData = _.flatten(data, key);

    x.range([0, width])
        .domain(d3.extent(flattenedData, function(d) { return d.year}))
    y.range([height, 0])
        .domain(d3.extent(flattenedData, function(d) { return d.value}));

    xAxis.scale(x);
    yAxis.scale(y);
  }

  function initChart(container) {
    //draw chart container
    var g = d3.select(container)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .classed("chart-line", true)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //draw clipping path for the animation
    clipPath = g.append("defs")
      .append("clipPath")
        .attr("id", "line-clip")
      .append("rect")
        .attr("width", 0)
        .attr("height", height);

    //draw x-axis
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    //draw y-axis
    g.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("y", -10)
        .attr("x", 10);
  }

  function drawData(data, g) {
    //create a <g> element for each city
    var cities = g.selectAll("[class*=city]")
        .data(data)
      .enter().append("g")
        .attr("class", function(d) { return "city " + d.City })
        .attr("clip-path", "url(#line-clip)");

    //draw line for each sensor_id
    cities.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d[key]); });

    var clipPathCounter = 0;

    function clipPathTransition() {
      clipPathCounter++;

      clipPath
        .transition()
        .duration(6000)
        .attr("width", clipPathCounter * width / 60);

      if (clipPathCounter === 59) {
        clearInterval(clipPathTimer);
      }
    }

    var clipPathTimer = setInterval(clipPathTransition, animationStepDuration);
  }

  function chart(selection) {
    selection.each(function(data) {
      init(data);
      initChart(this);
      var g = d3.select(this).select('svg g.chart-line');
      drawData(data, g);
    })
  }

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.key = function(_) {
    if (!arguments.length) return key;
    key = _;
    return chart;
  };

  return chart;
}