var poll = document.getElementById("poll");
var pollBox = document.getElementById("poll-box");
var back = document.getElementById("back");
poll.onclick = function(){blur(true)};
back.onclick = function(){blur(false)};
// pollBox.style.display = "none";

function clicked(element){
  document.getElementById(element).click();
}

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
            text: PollData,
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
            categories: [option1, option2, option3, option4]
        },
        yAxis: {
           gridLineWidth: .5,
		      gridLineDashStyle: 'dash',
		      gridLineColor: 'black',
           title: {
                text: 'Votes',
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
            name: 'Votes',
            data: [pc1,pc2,pc3,pc4]
        }]
    });
});