// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Instantiates the pie chart, passes in the data and draws it.
function drawChart(authorsData,divID) {
    google.charts.setOnLoadCallback(function() {
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
        var options = {'title':'Participation', 'width':'400', 'height':'300'};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById(divID));
        chart.draw(data, options);
    });
}

