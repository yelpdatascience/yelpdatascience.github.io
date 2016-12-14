// global variables for visualizations
var freqBar,
    bubbles;


// Initialize data
loadData();

// Load CSV file
function loadData() {

    queue()
        .defer(d3.csv, "visdata/useful_counts.csv")
        .defer(d3.csv, "visdata/funny_counts.csv")
        .defer(d3.csv, "visdata/cool_counts.csv")
        .defer(d3.json, "visdata/useful_words.json")
        .await(function(error, usefulCounts, funnyCounts, coolCounts, wordData) {

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
            bubbles = new Bubbles("bubbles", wordData);

    });
}

function dataManipulation() {
    freqBar.dataManipulation();
}
