$(document).ready(function() {
  $('#myChart').createPH(300, 40, 0);
  resetDB(function(res) {
	});
  update();
});

function update() {
	queue()
    .defer(d3.json, "/api/data")
    .await(makeGraphs);
}
update();
//SET TO UPDATE EVERY 10 SECONDS
//IN THE FUTURE SHOULD UPDATE BASED ON REAL TIME FOR WHEN THE DATA IS RECEIVED
setInterval(update, 100000000);


function makeGraphs(error, apiData) {

/********* Start Transformations *********/ 
	var dataSet = apiData;

	//Fill data array with 100 values from apiData; graphs only plot 100 values
	// most recent data is at 0 index?
	var data = [];
	// var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%SZ"); //pos uneccessary
	// apiData.forEach(function(d) {
	// 	d.timestamp = dateFormat.parse(d.timestamp); //slow down
	// });
	for (var i = 0; i < dataSet.length; i++) {
		data.push(apiData[i]);
	}
	// converts to Date object (just take substring .000Z)
	var parser = d3.time.format("%Y-%m-%dT%H:%M:%S.000Z");
	data.forEach(function(d) {
		d.timestamp = parser.parse(d.timestamp);
		// d.timestamp = d3.time.day(d.timestamp);
		// console.log(d.timestamp);
	});


/********* END *********/ 

/********* Create a Crossfilter instance and All *********/ 

	var trial = crossfilter(data);
	var all = trial.groupAll();

/********* END *********/ 

/********* Define Dimensions *********/ 
	// Dimensions are only for later filters (construct a dim on type and apply filters on type)

	// Later use dateDim to sort based on certain dates
	// var tempDim = trial.dimension(function (d) { return d.temperature; });
	var dateDim = trial.dimension(function (d) { return d.timestamp; });
	var minDate = dateDim.bottom(1)[0].timestamp;
	var maxDate = dateDim.top(1)[0].timestamp;

/********* END *********/ 

/********* Groups *********/ 
/* Uncomment only one section */ 
	// var turbidity = tempDim.group().reduceSum(function (d) { return d.turbidity; }); 
	// var conductivity = tempDim.group().reduceSum(function (d) { return d.conductivity; }); 
	// var pH = tempDim.group().reduceSum(function(d) { return d.pH; }); 
	// var temp = tempDim.group().reduceSum(function (d) { return d.temperature; }); 

	var turbidity = dateDim.group().reduceSum(function (d) { 
		return d.turbidity; 
	}); 
	var conductivity = dateDim.group().reduceSum(function (d) { return d.conductivity; }); 
	var pH = dateDim.group().reduceSum(function(d) { return d.pH; }); 
	var temp = dateDim.group().reduceSum(function (d) { return d.temperature; }); 

/********* END *********/ 

/********* Chart Declaration *********/ 

	// var overalllineChart = dc.lineChart("#dc-line-chart");
	var overalllineChart = dc.compositeChart("#dc-line-chart");
	var compositeChart1 = dc.compositeChart('#chart-container1');
	var conductivityChart = dc.pieChart("#dc-pie-chart");
	var usageLineChart = dc.lineChart("dc-line-chart")

/********* END *********/ 

/******* Overlayed line chart *******/

	overalllineChart
	    .width(768)
	    .height(480)
	    .x(d3.time.scale().domain([minDate, maxDate]))
	    .margins({top: 30, right: 50, bottom: 25, left: 60})
	    .brushOn(true)
	    .clipPadding(10)
	    .yAxisLabel("This is the Y Axis")
	    .elasticY(true)
	    .renderLabel(true)
	    .label(function (p) {
            return p.key;
        })

	    .round(d3.time.day.round) // select only day ranges
	    .dimension(dateDim)

		.compose([
			dc.lineChart(overalllineChart)
				.group(turbidity, 'Turbidity')
	// 			May need this later... (also .keyAccessor)
	//			 .valueAccessor(function (p) {
    //         		return p.value;
    //     		})
				.ordinalColors(["#FFC914"]), //line orange
			dc.lineChart(overalllineChart)
				.group(temp, 'Temperature')
				.ordinalColors(["#17BEBB"]),
			dc.lineChart(overalllineChart)
				.group(pH, 'pH')
				.ordinalColors(["#E4572E"]),
			dc.lineChart(overalllineChart)
				.group(conductivity, 'Conductivity')
				.ordinalColors(["#76B041"])
			])
	// conductivityChart
	// 	.width(250)
	// 	.height(250)
	// 	.radius(100)
	// 	.innerRadius(0)
	// 	.dimension(dateDim)
	// 	.group(conductivity)
	// 	// .title(function (d) { return d.value; });

	var gauge1 = loadLiquidFillGauge("turbidity-graph", 7);
	var config1 = liquidFillGaugeDefaultSettings();
	config1.circleColor = "#FF7777";
	config1.textColor = "#FF4444";
	config1.waveTextColor = "#FFAAAA";
	config1.circleThickness = 0.2;
	config1.textVertPosition = 0.2;
	config1.waveAnimateTime = 1000;
	config1.displayPercent = false;
	config1.minValue = 0;
	config1.maxValue = 10;

/********* Draw Graphs *********/ 

   dc.renderAll();
   dc.redrawAll();

/********* END *********/ 

};