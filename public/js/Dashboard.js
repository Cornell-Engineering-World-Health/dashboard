$(document).ready(function() {
  $('#myChart').createPH(280, 40, 7);
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

function getCurrent() {
	var current = document.getElementsByClassName("filter").value;
	 console.log(current);
}

function makeGraphs(error, apiData) {

/********* Start Transformations *********/ 
	var dataSet = apiData;

	var ewhData = [
    {"_id":"56e9ad499f57ee68386e4ecf","temperature":78,"turbidity":4,"conductivity":7,"pH":8,"usage":23,"__v":0,"timestamp":"2015-11-11T05:00:00.000Z"},
    {"_id":"56e9ad499f57ee68386e4ed0","temperature":54,"turbidity":9,"conductivity":4,"pH":6,"usage":25,"__v":0,"timestamp":"2015-11-12T05:00:00.000Z"},
    {"_id":"56e9ad499f57ee68386e4ed1","temperature":85,"turbidity":7,"conductivity":5,"pH":8,"usage":7,"__v":0,"timestamp":"2015-11-13T05:00:00.000Z"},
    {"_id":"56e9ad499f57ee68386e4ed2","temperature":54,"turbidity":9,"conductivity":4,"pH":6,"usage":9,"__v":0,"timestamp":"2015-11-14T05:00:00.000Z"},
    {"_id":"56e9ad499f57ee68386e4ed3","temperature":92,"turbidity":5,"conductivity":5,"pH":7,"usage":32,"__v":0,"timestamp":"2015-11-15T05:00:00.000Z"},
    {"_id":"56e9ad499f57ee68386e4ed4","temperature":37,"turbidity":7,"conductivity":5,"pH":4,"usage":10,"__v":0,"timestamp":"2015-11-16T05:00:00.000Z"}
    ];

	//Fill data array with 100 values from apiData; graphs only plot 100 values
	// most recent data is at 0 index?
	var data = [];
	var recentData = [];
	// var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%SZ"); //pos uneccessary
	// apiData.forEach(function(d) {
	// 	d.timestamp = dateFormat.parse(d.timestamp); //slow down
	// });
	for (var i = 0; i < dataSet.length; i++) {
		data.push(apiData[i]);
	}

	//  Get most recent data
	recentData.push(apiData[dataSet.length-1]);

	// converts to Date object (just take substring .000Z)
	var parser = d3.time.format("%Y-%m-%dT%H:%M:%S.000Z");
	data.forEach(function(d) {
		d.timestamp = parser.parse(d.timestamp);
		// d.timestamp = d3.time.day(d.timestamp);
		// console.log(d.timestamp);
	});
	ewhData.forEach(function(d) {
		d.timestamp = parser.parse(d.timestamp);
	});



/********* END *********/ 

/********* Create a Crossfilter instance and All *********/ 

	var trial = crossfilter(data);
	var all = trial.groupAll();

	var ndx = crossfilter(ewhData);
	var all2 = ndx.groupAll();

/********* END *********/ 

/********* Define Dimensions *********/ 
	// Dimensions are only for later filters (construct a dim on type and apply filters on type)

	// Later use dateDim to sort based on certain dates
	// var tempDim = trial.dimension(function (d) { return d.temperature; });
	var dateDim = trial.dimension(function (d) { return d.timestamp; });
	var minDate = dateDim.bottom(1)[0].timestamp;
	var maxDate = dateDim.top(1)[0].timestamp;

	var dateDim2 = ndx.dimension(function (d) { return d.timestamp; });
	var minDate2 = dateDim2.bottom(1)[0].timestamp;
	var maxDate2 = dateDim2.top(1)[0].timestamp;

/********* END *********/ 

/********* Groups *********/ 
/* Uncomment only one section */ 
	// var turbidity = tempDim.group().reduceSum(function (d) { return d.turbidity; }); 
	// var conductivity = tempDim.group().reduceSum(function (d) { return d.conductivity; }); 
	// var pH = tempDim.group().reduceSum(function(d) { return d.pH; }); 
	// var temp = tempDim.group().reduceSum(function (d) { return d.temperature; }); 

	var turbidity = dateDim.group().reduceSum(function (d) { return +d.turbidity; }); 
	var conductivity = dateDim.group().reduceSum(function (d) { return +d.conductivity; }); 
	var pH = dateDim.group().reduceSum(function(d) { return +d.pH; }); 
	var temp = dateDim.group().reduceSum(function (d) { return +d.temperature; }); 

	var usage = dateDim2.group().reduceSum(function (d) { return +d.usage; });

/********* END *********/ 

/********* Chart Declaration *********/ 

	// var overalllineChart = dc.compositeChart("#dc-line-chart");
	// var tempLine = dc.lineChart("#dc-line-chart");
	// var turbitityLine = dc.lineChart("#dc-line-chart");
	// var conductivityLine = dc.lineChart("#dc-line-chart");
	// var pHLine = dc.lineChart("#dc-line-chart");
	var lineChart = dc.lineChart("#dc-line-chart");
	var compositeChart1 = dc.lineChart('#chart-container1');
	var conductivityChart = dc.pieChart("#dc-pie-chart");
	var usagelineChart = dc.lineChart("#dc-usage-graph");
	var conductivityPie = dc.pieChart("#conductivity-pie-chart");
	var yearRingChart   = dc.pieChart("#chart-ring-year");
	var timeChart  = dc.barChart("#timeline");

	var usageBarChart = dc.barChart("#usage-bar-chart");

/********* END *********/ 

/******* Overlayed line chart *******/

	lineChart
		.width(868)
	    .height(480)
	    .x(d3.time.scale().domain([minDate, maxDate]))
	    .margins({top: 30, right: 50, bottom: 25, left: 60})
	    .brushOn(false)
	    .clipPadding(10)
	    .yAxisLabel("This is the Y Axis")
	    .elasticY(true)
	    .renderLabel(true)
	    .ordinalColors(["#E4572E"])
	    .rangeChart(timeChart)
	    .dimension(dateDim)
	    .group(temp);


	$("button").click( function () {
		$(this).addClass('active').siblings().removeClass('active');
		switch(this.id) {
			case "temperature":
				timeChart.filterAll();
				timeChart.render();
				lineChart
					.width(868)
				    .height(480)
				    .x(d3.time.scale().domain([minDate, maxDate]))
				    .margins({top: 30, right: 50, bottom: 25, left: 60})
				    .brushOn(false)
				    .clipPadding(10)
				    .yAxisLabel("This is the Y Axis")
				    .elasticY(true)
				    .renderLabel(true)
				    .ordinalColors(["#E4572E"])
				    .rangeChart(timeChart)
				    .dimension(dateDim)
				    .group(temp);
				lineChart.render();
				break;
			case "conductivity":
				timeChart.filterAll();
				timeChart.render();
				lineChart
					.width(868)
				    .height(480)
				    .x(d3.time.scale().domain([minDate, maxDate]))
				    .margins({top: 30, right: 50, bottom: 25, left: 60})
				    .brushOn(false)
				    .clipPadding(10)
				    .yAxisLabel("This is the Y Axis")
				    .elasticY(true)
				    .renderLabel(true)
				    .ordinalColors(["#FFC914"])
				    .rangeChart(timeChart)
				    .dimension(dateDim)
				    .group(conductivity);
				lineChart.render();
				break;
			case "turbidity":
				timeChart.filterAll();
				timeChart.render();
				lineChart
					.width(868)
				    .height(480)
				    .x(d3.time.scale().domain([minDate, maxDate]))
				    .margins({top: 30, right: 50, bottom: 25, left: 60})
				    .brushOn(false)
				    .clipPadding(10)
				    .yAxisLabel("This is the Y Axis")
				    .elasticY(true)
				    .renderLabel(true)
				    .ordinalColors(["#17BEBB"])
				    .rangeChart(timeChart)
				    .dimension(dateDim)
				    .group(turbidity);
				lineChart.render();
				break;
			case "pH":
				timeChart.filterAll();
				timeChart.render();
				lineChart
					.width(868)
				    .height(480)
				    .x(d3.time.scale().domain([minDate, maxDate]))
				    .margins({top: 30, right: 50, bottom: 25, left: 60})
				    .brushOn(false)
				    .clipPadding(10)
				    .yAxisLabel("This is the Y Axis")
				    .elasticY(true)
				    .renderLabel(true)
				    .ordinalColors(["#76B041"])
				    .rangeChart(timeChart)
				    .dimension(dateDim)
				    .group(pH);
				lineChart.render();
				break;
			// TODO: No fake data
			// case "usage":
			// 	lineChart
			// 		.width(868)
			// 	    .height(480)
			// 	    .x(d3.time.scale().domain([minDate, maxDate]))
			// 	    .margins({top: 30, right: 50, bottom: 25, left: 60})
			// 	    .brushOn(false)
			// 	    .clipPadding(10)
			// 	    .yAxisLabel("This is the Y Axis")
			// 	    .elasticY(true)
			// 	    .renderLabel(true)
			// 	    .rangeChart(timeChart)
			// 	    .dimension(dateDim)
			// 	    .group(usage);
			// 	break;
			default:
				return true;
		}
	})

	
	/*  Erin: Conductivity
		Create a new crossfilter instance based on recentData (copy how it was done above)
		Dimension: create a dimension title
		Group: create group based on value
	 */
	timeChart
		.height(40)
		.width(868)
		.margins({top: 0, right: 50, bottom: 20, left: 60})
	    .dimension(dateDim)
	    .group(pH)
	    .centerBar(true)
	    .brushOn(true)
	    .round(d3.time.day.round)
	    .alwaysUseRounding(true)
	    .x(d3.time.scale().domain([minDate, maxDate]))
	timeChart.render();


	conductivityPie
	    .width(768)
	    .height(480)
	    .dimension(dateDim)
	    .group(conductivity)
	    .innerRadius(50);
	yearRingChart
	    .dimension(dateDim)
	    .group(conductivity)
	    .innerRadius(145);
	yearRingChart.render();

	// usagelineChart
	// 	.width(768)
	//     .height(480)
	//     .x(d3.time.scale().domain([minDate, maxDate]))
	//     .margins({top: 30, right: 50, bottom: 25, left: 60})
	//     .dimension(dateDim2)
	//     .group(usage);


	var gauge1 = loadLiquidFillGauge("turbidity-graph", data[dataSet.length-1].conductivity);
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
	
	var ionData          = [ 
  { 'Name': 'ion1', 'Value': 10}, 
  { 'Name': 'ion2', 'Value': 20}, 
  { 'Name': 'ion3', 'Value': 30}, 
];
	var ndx = crossfilter(ionData);
	var condDim = ndx.dimension(function(d) { return d.Name; });
	var condGroup = condDim.group().reduceSum(function(d) {console.log(d);return d.Value;});

		
	conductivityChart
		.width(250)
		.height(250)
		.radius(100)
		.innerRadius(90)
		.dimension(condDim)
		.group(condGroup)
		.renderLabel(true)
		.label(function (d) { return d.value; });

	conductivityChart.render();

	var turbScale = d3.scale.linear().domain([0,20]).range(["#FFFCF7", "#ffe6b3"]);
	var config1 = liquidFillGaugeDefaultSettings();
	config1.waveColor = turbScale(data[dataSet.length-1].turbidity);
	config1.maxValue = data[dataSet.length-1].turbidity*1.3;
	var gauge1 = loadLiquidFillGauge("turbidity-graph", data[dataSet.length-1].turbidity, config1);	


	$('#myChart').updatePH(data[dataSet.length-1].pH);

	// Returns array of already parsed time
	// If dates are the same then return more current data
	$("#timeline").click( function () {
		console.log(timeChart.brush().extent());
	});
		

/************************** Single Day Usage Bar Chart ***************************/

var SELECTED_DAY = "2015-12-27T00:00:00Z";
var BAR_GRAPH_THICKNESS = 10;
//input d3 date object, returns boolean
var _isSelectedDay = function(d) {return (dayParser(timestampParser.parse(SELECTED_DAY))==dayParser(d))};

var singleDayData = [
    {timestamp: "2015-12-27T02:00:00Z", usage: 0},
    {timestamp: "2015-12-27T04:00:00Z", usage: 0},
    {timestamp: "2015-12-27T06:00:00Z", usage: 2},
    {timestamp: "2015-12-27T08:00:00Z", usage: 4},
    {timestamp: "2015-12-27T10:00:00Z", usage: 8},
    {timestamp: "2015-12-27T12:00:00Z", usage: 12},
    {timestamp: "2015-12-27T14:00:00Z", usage: 8},
    {timestamp: "2015-12-27T16:00:00Z", usage: 4},
    {timestamp: "2015-12-27T18:00:00Z", usage: 12},
    {timestamp: "2015-12-27T20:00:00Z", usage: 10},
    {timestamp: "2015-12-27T22:00:00Z", usage: 2},
    {timestamp: "2015-12-27T23:59:00Z", usage: 0},
    {timestamp: "2015-12-28T02:00:00Z", usage: 0},
    {timestamp: "2015-12-28T04:00:00Z", usage: 0},
    {timestamp: "2015-12-28T06:00:00Z", usage: 2},
    {timestamp: "2015-12-28T08:00:00Z", usage: 4},
    {timestamp: "2015-12-28T10:00:00Z", usage: 8},
    {timestamp: "2015-12-28T12:00:00Z", usage: 12},
    {timestamp: "2015-12-28T14:00:00Z", usage: 8},
    {timestamp: "2015-12-28T16:00:00Z", usage: 4},
    {timestamp: "2015-12-28T18:00:00Z", usage: 12},
    {timestamp: "2015-12-28T20:00:00Z", usage: 10},
    {timestamp: "2015-12-28T22:00:00Z", usage: 2},
    {timestamp: "2015-12-28T23:59:00Z", usage: 0}
    ];

//time parsers
var timestampParser = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
var dayParser = d3.time.format("%Y-%m-%d");

//Data formating and filtering
singleDayData.forEach(function(d) {
  d.timestamp = timestampParser.parse(d.timestamp);
  d.usage = d.usage;
});
var ndx = crossfilter(singleDayData);
var timestampDim = ndx.dimension( function(d) {return d.timestamp;});
var singleDayFilter = timestampDim.filterFunction(function(d) { if (_isSelectedDay(d)) {return d} });

//get y-axis
var usageGroup = singleDayFilter.group().reduceSum(dc.pluck('usage')); 

//set MIN MAX X-AXIS
var singleDayMinDate = singleDayFilter.bottom(1)[0].timestamp;
var singleDayMaxDate = singleDayFilter.top(1)[0].timestamp;

//graph code
//var usageBarChart  = dc.barChart("#usage-bar-chart"); 
usageBarChart
  .width(500).height(200).gap(20)
  .centerBar(true)
  .dimension(singleDayFilter)
  .group(usageGroup)
  .x(d3.time.scale().domain([singleDayMinDate,singleDayMaxDate]))
  .brushOn(false)
  .yAxisLabel("Well Usage")
  .xUnits(function(){return BAR_GRAPH_THICKNESS;});

usageBarChart.render();



/********* Draw Graphs *********/ 

   dc.renderAll();
   dc.redrawAll();

/********* END *********/ 

};