// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Instantiates the pie chart, passes in the data and draws it.
function drawChart(authorsData,divID) {
    google.charts.setOnLoadCallback(function() {drawChartImpl(authorsData,divID);});
    $(window).on('resize', function() {
        drawChartImpl(authorsData,divID);
    });
}

function drawChartImpl(authorsData, divID) {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'User');
    data.addColumn('number', 'Words used');
    var rows = [];
    for(var key in authorsData) {
        rows.push([key,authorsData[key].words]);
    }
    data.addRows(rows);

    // Set chart options
    chartSize = $("#"+divID).width();//HACK for responsive charts
    var options = {'title':'Participation', 'width':(chartSize-4), 'height':(chartSize*3.0/4.0)};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById(divID));
    chart.draw(data, options);
}

//em converter
function em(input) {
    var emSize = parseFloat($("body").css("font-size"));
    return (emSize * input);
}

