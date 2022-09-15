var poll = document.getElementById("poll");
var pollBox = document.getElementById("poll-box");
var back = document.getElementById("back");
poll.onclick = function(){blur(true)};
back.onclick = function(){blur(false)};
// pollBox.style.display = "none";


function blur(toggle){
  if (toggle){
    pollBox.style.visibility = "visible"
    document.getElementById("article_container").style.filter = "blur(8px)";
    document.getElementById("article_container").style.pointerEvents = "none";
    pollBox.style.opacity = "1"
  }
  else{
    pollBox.style.visibility = "hidden"
    document.getElementById("article_container").style.filter = "blur(0px)";
    document.getElementById("article_container").style.pointerEvents = "auto";
    pollBox.style.opacity = "0"
  }
}

// chart
$(function () { 
  Highcharts.setOptions({
    colors: ['#3a6f8a'],
    chart: {
        style: {
            fontFamily: 'sans-serif',
            color: '#fff'
        }
    }
});  
  $('#container').highcharts({
        chart: {
            type: 'column',
            backgroundColor: '#36394B'
        },
        title: {
            text: 'Weekly Revenue',
            style: {  
              color: '#fff'
            }
        },
        xAxis: {
            tickWidth: 0,
            labels: {
              style: {
                  color: '#fff',
                 }
              },
            categories: ['May 5 sfasfasfasfaf asda sd saf asf', 'May 6', 'May 7', 'May 8', 'May 9', 'May 10', 'May 11']
        },
        yAxis: {
           gridLineWidth: .5,
		      gridLineDashStyle: 'dash',
		      gridLineColor: 'black',
           title: {
                text: '',
                style: {
                  color: '#fff'
                 }
            },
            labels: {
              formatter: function() {
                        return '$'+Highcharts.numberFormat(this.value, 0, '', ',');
                    },
              style: {
                  color: '#fff',
                 }
              }
            },
        legend: {
            enabled: false,
        },
        credits: {
            enabled: false
        },
        tooltip: {
           valuePrefix: '$'
        },
        plotOptions: {
		      column: {
			      borderRadius: 2,
             pointPadding: 0,
			      groupPadding: 0.1
            } 
		    },
        series: [{
            name: 'Revenue',
            data: [2200, 2800, 2300, 1700, 2000, 1200, 1400]
        }]
    });
});