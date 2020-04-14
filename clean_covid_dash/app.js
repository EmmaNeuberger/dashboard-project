// # Plotly covid 

// Populate dropdown menu
var url = "https://covidtracking.com/api/v1/states/current.json";

d3.json(url).then(function(data) {
    console.log(data);
});


// Populate dropdown menu
d3.json(url).then(data => {
        
    var data = data;
    console.log(data);
    
    // Isolate patient IDs to add to dropdown
    var stateIDs = data.map(x => x.state);
    console.log(stateIDs);

    // Append options to the dropdownmenu with patientIDs
    for (var i = 0; i < stateIDs.length; i++) {
        dropdownMenu = d3.select("#selState");
        dropdownMenu.append("option").text(stateIDs[i]);
    };
});


// // Event handler
function optionChanged (stateSel) {
    console.log(stateSel);
    plotCurrent(stateSel);
    plotHistorical(stateSel)
}


function plotCurrent (stateSel) {

    // Tracking when the function changes
    console.log(`Selection:${stateSel}`);


    // Read data in json and create variables for data and patientIDs
    // Creating a promise to work with data - so all other manipulation must be within this function
    d3.json(url).then(data => {

        // var recentData = data.filter(x => x.date === "2020-04-06")

        var selectionData = data.filter(x => x.state === stateSel);
        console.log(selectionData);


        // Select HTML element
        var casesWindow = d3.select('#cases');
        var deathsWindow = d3.select('#deaths');
        var hospitalizationsWindow = d3.select('#hospitalizations');
        var testsWindow = d3.select('#tests');

        // Clear windows
        casesWindow.html('');
        deathsWindow.html('');
        hospitalizationsWindow.html('');
        testsWindow.html('');
  
        // casesWindow.append('p').text(`${selectionData[0].state}`);
        casesWindow.append('p').text(`${selectionData[0].positive}`);

        // deathsWindow.append('p').text(`${selectionData[0].state}`);
        deathsWindow.append('p').text(`${selectionData[0].death}`);

        // hospitalizationsWindow.append('p').text(`${selectionData[0].state}`);
        hospitalizationsWindow.append('p').text(`${selectionData[0].hospitalized}`);

        // testsWindow.append('p').text(`${selectionData[0].state}`);
        testsWindow.append('p').text(`${selectionData[0].totalTestResults}`);


        // Chart - combined tests cases, hospitalized by state
        var currentStates = data.map(x => x.state);
        var totalTests = data.map(x => x.totalTestResults);
        var totalCases = data.map(x => x.positive);
        var totalHospitalized = data.map(x => x.hospitalized);

        var combinedData = [{
            x: currentStates,
            y: totalTests,
            type: "bar",
            name: "Total Tests",
            marker: {
                color: "##27608a"
              }
        },
        {
            x: currentStates,
            y: totalCases,
            type: "bar",
            name: "Total Cases",
            marker: {
                color: "#5cc19e"
              }
        },
        {
            x: currentStates,
            y: totalHospitalized,
            type: "bar",
            name: "Total Hospitalized",
            marker: {
                color: "#f49439"
              }
        }];   

        var combinedLayout = {
            title: "Tests, Cases, and Hospitalizations by State", 
            yaxis: {title: ""},
            height: 400,
            width: 1200
        };

        Plotly.newPlot("combineddata", combinedData, combinedLayout);

})
}


function plotHistorical (stateSel) {
    url = "https://covidtracking.com/api/v1/states/daily.json"
    d3.json(url).then(data => {

        console.log(data)

        // Isolating data to just the selected State
        var selData = data.filter(x => x.state === stateSel);

        // Isolate and reformat date data
        var selDates = selData.map(x => x.date);
        var reformattedDates = []

        for (i=0; i < selDates.length; i++) {
            adate = selDates[i];
            newdate = adate.toString().replace(/(\d{4})(\d{2})(\d+)/, '$1-$2-$3');
            reformattedDates.push(newdate);
            console.log(newdate);
        };

        var selCases = selData.map(x => x.positive);
        var selDeaths = selData.map(x => x.death);

        var stateData = [{
            x: reformattedDates,
            y: selCases,
            name: "Cases",
            type: "bar",
            marker: {
                color: "#5cc19e"
              }
        },
        {
            x: reformattedDates,
            y: selDeaths,
            name: "Deaths",
            type: "bar",
            marker: {
                color: "#f49439"
              }
        }]

        var stateLayout = {
            title: `${stateSel}`, 
            yaxis: {title: "Total Cases"},
            height: 300,
            width: 1200
        };

        Plotly.newPlot("historicalstate", stateData, stateLayout);
    })
}

// Default plot: Colorado
plotCurrent ('AK')
plotHistorical ('AK')