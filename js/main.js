// global variables for visualizations
var freqBar,
    bubbles,
    biasLine;


// Initialize data
loadData();

// Load files
function loadData() {

    queue()
        .defer(d3.csv, "visdata/useful_counts.csv")
        .defer(d3.csv, "visdata/funny_counts.csv")
        .defer(d3.csv, "visdata/cool_counts.csv")
        .defer(d3.json, "visdata/useful_words.json")
        .defer(d3.csv, "visdata/bias_accuracies.csv")
        .await(function(error, usefulCounts, funnyCounts, coolCounts, wordData, biasData) {

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

            biasData.forEach(function(d) {
                d.pctChange = +d.pctChange;
                d.posAcc = +d.posAcc;
                d.negAcc = +d.negAcc;
            });

            console.log(biasData);

            // Instantiate visualizations
            freqBar = new FreqBar("freq-bar", usefulCounts, funnyCounts, coolCounts);
            // bubbles = new Bubbles("bubbles", wordData);
            biasLine = new BiasLine("bias-line", biasData);

    });
}

function dataManipulation() {
    freqBar.dataManipulation();
}
