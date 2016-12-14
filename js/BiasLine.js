/*
 *  BiasLine - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

BiasLine = function(_parentElement, _data) {

    this.parentElement = _parentElement;
    this.data = _data;

    var vis = this;

    // initialize visualization
    this.initVis();
};

/*
 *  Initialize line graph
 */

BiasLine.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 20, right: 50, bottom: 10, left: 90};

    vis.width = 900 - vis.margin.right - vis.margin.left;
    vis.height = 400 - vis.margin.top - vis.margin.bottom;


    // append drawing space
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);


    // DRAW AXES
    // initialize x axis scale
    vis.x = d3.scale.linear()
        .domain([1, d3.max(vis.data, function (d) {
            return d.pctChange + 0.5;
        })])
        .range([0, vis.width]);
    // initialize y axis scale
    vis.y = d3.scale.linear()
        .domain([0, 1.05])
        .range([vis.height, 0]);

    // initialize x axis
    vis.barXAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");
    // initialize y axis
    vis.barYAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");

    // Draw the x axis
    vis.svg.append("g")
        .attr("class", "axis x-axis")
        .call(vis.barXAxis)
        .attr("transform", "translate(" + vis.margin.left + "," + vis.height + ")");
    // Draw the y axis
    vis.svg.append("g")
        .attr("class", "axis y-axis")
        .call(vis.barYAxis)
        .attr("transform", "translate(" + vis.margin.left + ", 0)");

    // Label the x axis
    vis.svg.append("text")
        .attr("class", "axis-label x-label")
        .attr("x", vis.width - 100)
        .attr("y", vis.height - 10)
        .text("Percentage from Balanced");
    // Label the y axis
    vis.svg.append("text")
        .attr("class", "axis-label y-label")
        .attr("transform", "translate(" + vis.margin.left/3 + ", " + vis.height/2 + "), rotate(270)")
        .text("Accuracy of Model");


    // DRAW LINES

    // draw line for positive accuracy
    vis.posLine = d3.svg.line()
        .x(function(d) {
            return vis.x(d.pctChange);
        })
        .y(function(d) {
            return vis.y(d.posAcc);
        })
        .interpolate("linear");
    vis.posLinegraph = vis.svg.append("path")
        .datum(vis.data);
    vis.posLinegraph
        .attr("class", "posLine")
        .attr("d", vis.posLine)
        .attr("transform", "translate(" + vis.margin.left + ", 0)");
    // draw line for negative accuracy
    vis.negLine = d3.svg.line()
        .x(function(d) {
            return vis.x(d.pctChange);
        })
        .y(function(d) {
            return vis.y(d.negAcc);
        })
        .interpolate("linear");
    vis.negLinegraph = vis.svg.append("path")
        .datum(vis.data);
    vis.negLinegraph
        .attr("class", "negLine")
        .attr("d", vis.negLine)
        .attr("transform", "translate(" + vis.margin.left + ", 0)");

    // DRAW LEGEND
    vis.legendContainer = vis.svg.append("g");

    vis.legendContainer
        .attr("transform", function() {
            return "translate(100, 20)"; });

    vis.legendBox = vis.legendContainer.append('rect')
        .attr('class', 'key')
        .attr('width', 140)
        .attr('height', function() {
            return 2 * 20;
        })
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5);

    // append legend
    vis.legend = vis.legendContainer.selectAll('g.legendEntry')
        .data(['#008500', '#ce0000'])
        .enter().append('g')
        .attr('class', 'legendEntry');

    vis.legend
        .append('rect')
        .attr("x", 5)
        .attr("y", function(d, i) {
            return i * 20 + 5;
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("stroke", "none")
        .style("fill", function(d){
            return d;
        });

    //the data objects are the fill colors
    vis.legend
        .append('text')
        .attr("x", 20)
        .attr("y", function(d, i) {
            return i * 20 + 15;
        })
        .text(function(d, i) {
            var extent = ['Positive Accuracy', 'Negative Accuracy'];
            return extent[i];
        });

};
