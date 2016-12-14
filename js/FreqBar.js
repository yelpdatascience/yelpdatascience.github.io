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
    vis.allTypes = ["Useful", "Funny", "Cool"];

    // List of color schemes
    vis.rectCol = ["#F15C00", "#41A700", "#0097EC"];

    // start visualization by showing 'useful' votes
    vis.selVal = 0;
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
        .domain(d3.range(15))
        .rangeRoundBands([0, vis.width]);
    // initialize y axis scale (using useful data)
    vis.y = d3.scale.linear()
        .domain([0, d3.max(vis.allData[1], function (d) {
            return d.freq + 10000;
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
        .attr("x", vis.width - 70)
        .attr("y", vis.height - 10)
        .text("Number of Votes on Post");

    // Label the y axis
    vis.svg.append("text")
        .attr("class", "axis-label y-label")
        .attr("transform", "translate(10, " + vis.height/2 + "), rotate(270)")
        .text("Frequency");

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

    // print type of votes being visualized
    document.getElementById('type').innerHTML = (vis.allTypes[vis.selVal]);
    console.log(vis.selData[0]);
    // print number of posts with zero views
    document.getElementById('zeros').innerHTML = (vis.selData[0].freq).toString();

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
            if (d.num < 15) {
                return 5 + vis.x(d.num) + vis.margin.left;
            }
            // don't let values for voteNum > 15 appear
            else {
                return -100;
            }
        })
        .attr("y", function(d) {
            return vis.y(d.freq);
        })
        .attr("width", 40)
        .attr("height", function(d) {
            return vis.height - vis.y(d.freq);
        })
        .attr("fill", vis.rectCol[vis.selVal]);

    // Exit
    vis.rect.exit().remove();
};