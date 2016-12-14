/*
 *  Bubbles - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

Bubbles = function(_parentElement, _wordsData) {

    this.parentElement = _parentElement;
    this.data = _wordsData;

    var vis = this;

    // initialize visualization
    this.initVis();

};

/*
 *  Initialize bubbles
 */

Bubbles.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 10, right: 10, bottom: 10, left: 70};

    vis.width = 800 - vis.margin.right - vis.margin.left;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height);

    vis.borderPath = vis.svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", vis.height)
        .attr("width", vis.width)
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 5);

    vis.force = d3.layout.force()
        .gravity(0)
        .size([vis.width, vis.height]);


    vis.nodes = vis.data;

    vis.node = vis.svg.selectAll(".node")
        .data(vis.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(vis.force.drag);

    vis.node.append("circle")
        .attr("r", function(d){
            return Math.floor(Math.sqrt(Math.abs(d.total)/Math.PI)*100);
        })
        .attr('fill', function(d){
            if (d.total > 0){
                return 'blue';
            }
            else{
                return 'red'
            }
        })
        // .on("mouseover", function(d) {
        //     // tooltips!
        //     // d3.select("#tip_title")
        //     //     .html(d.n_name);
        //     // d3.select('#tooltip').select("#value")
        //     //     .html(d.total);
        //     // d3.select("#tooltip").classed("hidden", false);
        //
        // })
        // .on("mouseout", function() {
        //
        //     //Hide the tooltip
        //     // d3.select("#tooltip").classed("hidden", true);
        // })
        .call(vis.force.drag);

    vis.force
        .nodes(vis.nodes)
        .start();

    vis.force.on("tick", function() {

        //I think that translate changes all of the x and ys at once instead of one by one? idk though
        vis.svg.selectAll("circle")
            .attr("cx", function(d) {
                return d.x = Math.max(vis.getRadius(Math.abs(d.total)) + 5, Math.min(vis.width
                    - vis.getRadius(Math.abs(d.total)) - 5, d.x));
            })
            .attr("cy", function(d) {
                return d.y = Math.max(vis.getRadius(Math.abs(d.total)) + 4, Math.min(vis.height
                    - vis.getRadius(Math.abs(d.total)) - 4, d.y));
            });

        vis.node.each(vis.collide(.3));

    });
};


// function to get the radius of each bubble
Bubbles.prototype.getRadius = function(total){
    return Math.floor(Math.sqrt(Math.abs(total)/Math.PI)*100);
};



Bubbles.prototype.collide = function(alpha) {
    var vis = this;

    var quadtree = d3.geom.quadtree(vis.nodes);
    return function(d) {
        var rb = 2 * vis.getRadius(Math.abs(d.total)) + 1,
            nx1 = d.x - rb,
            nx2 = d.x + rb,
            ny1 = d.y - rb,
            ny2 = d.y + rb;

        quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y);
                if (l < rb) {
                    l = (l - rb) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
};