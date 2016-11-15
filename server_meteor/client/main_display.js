import './styles/loader.js';
import './styles/bootstrap.js';
import './styles/toggle.css';
import './styles/bootstrap2.css';
import './styles/jquery.js';

// Work so that hovering is a bit more natural

google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {

        var data = google.visualization.arrayToDataTable([
          ['Task', 'Bn of Euros'],
          ['Cross-EU sales', 1],
          ['Domestic sales',  14],
          ['Placeholder', 0],
          ['US sales',  27]
        ]);

        var options = {
          backgroundColor: '#83aff7',
          legend: 'position: none',
          title: 'European Tech Sector Breakdown'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      }