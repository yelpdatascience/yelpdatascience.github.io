/*
 *  FreqBar - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

FreqBar = function(_parentElement, _usefulData, _funnyData, _coolData) {

    this.parentElement = _parentElement;
    this.usefulData = _usefulData;
    this.funnyData = _funnyData;
    this.coolData = _coolData;

    var vis = this;

    // List of all data
    vis.allData = [vis.usefulData, vis.funnyData, vis.coolData];

    // start visualization by showing 'useful' votes
    vis.selData = vis.usefulData;

    // initialize visualization
    this.initVis();
};

/*
 *  Initialize bar graph
 */

FreqBar.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 20, right: 50, bottom: 10, left: 70};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.right - vis.margin.left;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;


    // append drawing space
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.right + vis.margin.left)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);


    // INIT AXES (useful)

    // initialize x axis scale (using useful data)
    vis.x = d3.scale.ordinal()
        .rangeRoundBands([0, vis.width], .1);
    // initialize y axis scale (using useful data)
    vis.y = d3.scale.linear()
        .domain([0, d3.max(vis.selData, function (d) {
            return d.freq;
        })])
        .range([vis.height, 0]);

    // initialize x axis
    vis.barXAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");
    // initialize y axis
    vis.barYAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");

    vis.updateVis();
};

// function to determine what the selected value to group by is
FreqBar.prototype.dataManipulation = function() {

    var vis = this;

    vis.selVal = $('input[name="options"]:checked', '#vote-type').val();
    vis.selData = vis.allData[vis.selVal];

    // update visualization with new selected value
    vis.updateVis();
};


// function to update the bar chart based on new selected value
FreqBar.prototype.updateVis = function() {

    var vis = this;

    console.log(vis.selData);

    // DRAW AXES
    // update domains
    // vis.x
    //     .domain([0, d3.max(vis.selData, function (d) {
    //         return d.num;
    //     })]);

    vis.y
        .domain([0, d3.max(vis.selData, function (d) {
            return d.freq;
        })]);

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

    // update axes
    vis.svg.selectAll("g.y-axis")
        .transition()
        .duration(500)
        .call(vis.barYAxis);
    vis.svg.selectAll("g.x-axis")
        .transition()
        .duration(500)
        .call(vis.barXAxis);

    // DRAW BARS
    // Data-join (rectangle now contains the update selection)
    vis.rect = vis.svg.selectAll("rect")
        .data(vis.selData);

    // Enter (initialize the newly added elements)
    vis.rect.enter().append("rect")
        .attr("class", "bar");

    // Update (set the dynamic properties of the elements)
    vis.rect
        .transition()
        .duration(500)
        .attr("x", function(d) {
            return vis.x(d.num) + vis.margin.left;
        })
        .attr("y", function(d) {
            return vis.y(d.freq);
        })
        .attr("width", 50)
        .attr("height", function(d) {
            return vis.height - vis.y(d.freq);
        });

    // Exit
    vis.rect.exit().remove();
};