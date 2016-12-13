// global variables for visualizations
var freqBar;


// Initialize data
loadData();

// Load CSV file
function loadData() {

    queue()
        .defer(d3.csv, "visdata/useful_counts.csv")
        .defer(d3.csv, "visdata/funny_counts.csv")
        .defer(d3.csv, "visdata/cool_counts.csv")
        .await(function(error, usefulCounts, funnyCounts, coolCounts) {

            // clean data and make it numeric
            usefulCounts.forEach(function(d){
                d.num = +d.num;
                d.freq = +d.freq;
            });
            funnyCounts.forEach(function(d){
                d.num = +d.num;
                d.freq = +d.freq;
            });
            coolCounts.forEach(function(d){
                d.num = +d.num;
                d.freq = +d.freq;
            });


            // Instantiate visualizations
            freqBar = new FreqBar("freq-bar", usefulCounts, funnyCounts, coolCounts);

    });
}

function dataManipulation() {
    freqBar.dataManipulation();
}
