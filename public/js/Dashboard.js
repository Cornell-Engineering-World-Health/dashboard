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
	var usageBarChart  = dc.barChart("#usage-bar-chart");

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

	var turbScale = d3.scale.linear().domain([0,20]).range(["#FFFCF7", "#ffe6b3"]);
	var config1 = liquidFillGaugeDefaultSettings();
	config1.waveColor = turbScale(data[dataSet.length-1].turbidity);
	config1.maxValue = data[dataSet.length-1].turbidity*1.3;
	var gauge1 = loadLiquidFillGauge("turbidity-graph", data[dataSet.length-1].turbidity, config1);	


	$('#myChart').updatePH(data[dataSet.length-1].pH);
		
	conductivityChart
		.width(250)
		.height(250)
		.radius(100)
		.innerRadius(0)
		.dimension(dateDim)
		.group(conductivity)
		// .title(function (d) { return d.value; });

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