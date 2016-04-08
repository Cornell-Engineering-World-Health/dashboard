var date;
$(document).ready(function() {
  $('#myChart').createPH(200, 40, 7);
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
}

function updateTemp(recentData) {
	$("#thermo").empty();
	var cTemp = recentData.temperature;
	console.log(cTemp);

var width = 80,
    height = 180,
    maxTemp = 80,
    minTemp = 0,
    currentTemp = cTemp;

//[red, yellow, green, yellow, red]
//[1, 10, 15, 25]
//[33.8, 50, 59, 77]
function getTempColor(){
    	if(cTemp >= 50 && cTemp <= 59){
    		$('#indiv-temp').css("background-color", "#33cc33");
    		return "#33cc33";
    	}
    	else if ((cTemp >= 34 && cTemp <= 50) || (cTemp >= 59 && cTemp <= 77)){
    		$('#indiv-temp').css("background-color", "gold");
    		return "gold";
    	}
    	else{
    		$('#indiv-temp').css("background-color", "#FF0000");
    		return "#FF0000";
    	}
    };



var bottomY = height - 5,
    topY = 5,
    bulbRadius = 20,
    tubeWidth = 21.5,
    tubeBorderWidth = 1,
    mercuryColor = getTempColor(),
    innerBulbColor = "rgb(230, 200, 200)"
    tubeBorderColor = "#999999";

var bulb_cy = bottomY - bulbRadius,
    bulb_cx = width/2,
    top_cy = topY + tubeWidth/2;


var svg = d3.select("#thermo")
  .attr("width", width)
  .attr("height", height);

var defs = svg.append("defs");

// Define the radial gradient for the bulb fill colour
var bulbGradient = defs.append("radialGradient")
  .attr("id", "bulbGradient")
  .attr("cx", "50%")
  .attr("cy", "50%")
  .attr("r", "50%")
  .attr("fx", "50%")
  .attr("fy", "50%");

bulbGradient.append("stop")
  .attr("offset", "90%")
  .style("stop-color", mercuryColor);


// Circle element for rounded tube top
svg.append("circle")
  .attr("r", tubeWidth/2)
  .attr("cx", width/2)
  .attr("cy", top_cy)
  .style("fill", "#FFFFFF")
  .style("stroke", tubeBorderColor)
  .style("stroke-width", tubeBorderWidth + "px");


// Rect element for tube
svg.append("rect")
  .attr("x", width/2 - tubeWidth/2)
  .attr("y", top_cy)
  .attr("height", bulb_cy - top_cy)
  .attr("width", tubeWidth)
  .style("shape-rendering", "crispEdges")
  .style("fill", "#FFFFFF")
  .style("stroke", tubeBorderColor)
  .style("stroke-width", tubeBorderWidth + "px");


// White fill for rounded tube top circle element
// to hide the border at the top of the tube rect element
svg.append("circle")
  .attr("r", tubeWidth/2 - tubeBorderWidth/2)
  .attr("cx", width/2)
  .attr("cy", top_cy)
  .style("fill", "#FFFFFF")
  .style("stroke", "none")

// Main bulb of thermometer (empty), white fill
svg.append("circle")
  .attr("r", bulbRadius)
  .attr("cx", bulb_cx)
  .attr("cy", bulb_cy)
  .style("fill", "#FFFFFF")
  .style("stroke", tubeBorderColor)
  .style("stroke-width", tubeBorderWidth + "px");


// Rect element for tube fill colour
svg.append("rect")
  .attr("x", width/2 - (tubeWidth - tubeBorderWidth)/2)
  .attr("y", top_cy)
  .attr("height", bulb_cy - top_cy)
  .attr("width", tubeWidth - tubeBorderWidth)
  .style("shape-rendering", "crispEdges")
  .style("fill", "#FFFFFF")
  .style("stroke", "none");


// Scale step size
var step = 20;

// Determine a suitable range of the temperature scale
// Fahrenheit
var domain = [
  step * Math.floor(minTemp / step),
  step * Math.ceil(maxTemp / step)
  ];

if (minTemp - domain[0] < 0.66 * step)
  domain[0] -= step;

if (domain[1] - maxTemp < 0.66 * step)
  domain[1] += step;


// D3 scale object
var scale = d3.scale.linear()
  .range([bulb_cy - bulbRadius/2 - 8.5, top_cy])
  .domain(domain);


var tubeFill_bottom = bulb_cy,
    tubeFill_top = scale(currentTemp);

var bar = svg.append("rect")
	.attr("class", "tempRec")
	.attr("x", width/2 - (tubeWidth - 10)/2)
	.attr("y", tubeFill_top)
	.attr("width", tubeWidth - 10)
	.attr("height", 0)
	.style("shape-rendering", "crispEdges")
	.style("fill", mercuryColor)

	bar
	.transition().duration(750)
	.attr("class", "tempRec")
	.attr("x", width/2 - (tubeWidth - 10)/2)
	.attr("y", tubeFill_top)
	.attr("width", tubeWidth - 10)
	.attr("height", tubeFill_bottom - tubeFill_top)
	.style("shape-rendering", "crispEdges")
	.style("fill", mercuryColor)


// Main thermometer bulb fill
svg.append("circle")
  .attr("r", bulbRadius - 6)
  .attr("cx", bulb_cx)
  .attr("cy", bulb_cy)
  .style("fill", "url(#bulbGradient)")
  .style("stroke", mercuryColor)
  .style("stroke-width", "2px");


// Values to use along the scale ticks up the thermometer
//Fahrenheit
var tickValues = d3.range((domain[1] - domain[0])/step + 1).map(function(v) { return domain[0] + v * step; });

// D3 axis object for the temperature scale
//Fahrenheit
var axis = d3.svg.axis()
  .scale(scale)
  .innerTickSize(7)
  .outerTickSize(0)
  .tickValues(tickValues)
  .orient("left");


// Add the axis to the image
var svgAxis = svg.append("g")
  .attr("id", "tempScale")
  .attr("transform", "translate(" + (width/2 - tubeWidth/2) + ",0)")
  .call(axis);

// Format text labels
svgAxis.selectAll(".tick text")
    .style("fill", "#E3E0E0")
    .style("font-size", "10px");

// Set main axis line to no stroke or fill
svgAxis.select("path")
  .style("stroke", "none")
  .style("fill", "none")

// Set the style of the ticks 
svgAxis.selectAll(".tick line")
  .style("stroke", tubeBorderColor)
  .style("shape-rendering", "crispEdges")
  .style("stroke-width", "1px");



/********* End Thermometer *********/ 
}

function updateUsage(recentData) {
	console.log(recentData.timestamp);
	var SELECTED_DAY = recentData.timestamp;
	var BAR_GRAPH_THICKNESS = 10;
	//input d3 date object, returns boolean
	var _isSelectedDay = function(d) {return (dayParser(SELECTED_DAY)==dayParser(d))};

	var singleDayData = [
	    {timestamp: "2015-11-11T02:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T04:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T06:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T08:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T10:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T12:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T14:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T16:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T18:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T20:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T22:00:00Z", usage: 0},
	    {timestamp: "2015-11-11T23:59:00Z", usage: 0},
	    {timestamp: "2015-11-12T02:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T04:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T06:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T08:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T10:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T12:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T14:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T16:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T18:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T20:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T22:00:00Z", usage: 4},
	    {timestamp: "2015-11-12T23:59:00Z", usage: 4},
	    {timestamp: "2015-11-16T02:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T04:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T06:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T08:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T10:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T12:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T14:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T16:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T18:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T20:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T22:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T23:59:00Z", usage: 8}
	    ];

	//time parsers
	var timestampParser = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
	var dayParser = d3.time.format("%Y-%m-%d");

	//Data formating and filtering
	singleDayData.forEach(function(d) {
	  d.timestamp = timestampParser.parse(d.timestamp);
	  d.usage = d.usage;
	});

	var usageBarChart = dc.barChart("#usage-bar-chart");
	
	var ndx = crossfilter(singleDayData);
	var timestampDim = ndx.dimension( function(d) {return d.timestamp;});
	var singleDayFilter = timestampDim.filterFunction(function(d) { 
		// console.log(d);
		// console.log(_isSelectedDay(d));
		if (_isSelectedDay(d)) {
		// console.log(d);
		return d;} });

	//get y-axis
	var usageGroup = singleDayFilter.group().reduceSum(dc.pluck('usage'));

	//set MIN MAX X-AXIS
	var singleDayMinDate = singleDayFilter.bottom(1)[0].timestamp;
	// var singleDayMinDate = singleDayFilter.bottom(1)[0];
	// console.log(singleDayMinDate);
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
}

function makeGraphs(error, apiData) {

/********* Start Transformations *********/ 

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
	// var dateFormat = d3.time.format("%Y-%m-%dT%H:%M:%SZ"); //pos uneccessary
	// apiData.forEach(function(d) {
	// 	d.timestamp = dateFormat.parse(d.timestamp); //slow down
	// });
	for (var i = 0; i < apiData.length; i++) {
		data.push(apiData[i]);
	}
	//  Get most recent data
	var recentData = apiData[apiData.length-1];

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

	var trial = crossfilter(apiData);
	var all = trial.groupAll();

	var dataCross = crossfilter(data);
	var all = dataCross.groupAll();

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

	// var dataDateDim = dataCross.dimension(function (d) { return d.timestamp; });

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
	updateUsage(recentData);

	updateCond(recentData);

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

	$("button").click( function () {
		$(this).addClass('active').siblings().removeClass('active');
		switch(this.id) {
			case "temperature":
				// timeChart.filterAll();
				// timeChart.render();
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
				// timeChart.filterAll();
				// timeChart.render();
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
				// timeChart.filterAll();
				// timeChart.render();
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
	});

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


	/*************** TURBIDITY GRAPH ***************/

	var cTurb = data[apiData.length-1].turbidity;

	

	// var gauge1 = loadLiquidFillGauge("turbidity-graph", recentData.turbidity);
	// var config1 = liquidFillGaugeDefaultSettings();
	// config1.circleColor = "#FF7777";
	// config1.textColor = "#FF4444";
	// config1.waveTextColor = "#FFAAAA";
	// config1.circleThickness = 0.2;
	// config1.textVertPosition = 0.2;
	// config1.waveAnimateTime = 1000;
	// config1.displayPercent = false;
	// config1.minValue = 0;
	// config1.maxValue = 10;

	function getTurbColor(){
    	if(cTurb <= 500){
    		$('#indiv-turb').css("background-color", "green");
    		return "#33cc33";
    	}
    	else{
    		$('#indiv-turb').css("background-color", "red");
    		return "#FF0000";
    	}
    };

	var config1 = liquidFillGaugeDefaultSettings();
	config1.waveColor = getTurbColor();
	config1.circleColor = getTurbColor();
	config1.waveTextColor = "#ffffff";
	config1.maxValue = data[apiData.length-1].turbidity*1.3;
	var gauge1 = loadLiquidFillGauge("turbidity-graph", data[apiData.length-1].turbidity, config1);	
	
	/*************** END TURBIDITY GRAPH ***************/

	function updateCond(recentData){
		//$('#indiv-cond').empty();
		var cMg = recentData.magnesium;
		var cNa = recentData.sodium;
		var cCa = recentData.calcium;

		

		var ionData          = [ 
		  { 'Name': 'Calcium', 'Value': recentData.calcium}, 
		  { 'Name': 'Sodium', 'Value': recentData.sodium}, 
		  { 'Name': 'Magnesium', 'Value': recentData.magnesium}, 
		];

		var ndx = crossfilter(ionData);
		var condDim = ndx.dimension(function(d) { return d.Name; });
		var condGroup = condDim.group().reduceSum(function(d) { return d.Value;});

		var gColors = d3.scale.ordinal().range(["#00cc00", "#00b200", "#00ff00"]);
		//var yColors = d3.scale.ordinal().range(["#ffd700", "#ffe34c", "#ffeb7f"]);
		var rColors = d3.scale.ordinal().range(["#ff0000", "#ff4c4c", "#ff6666"]);
			
		function getColorScale(){
			if(cNa < 200 && ((cMg + cNa + cCa) <= 150)){
				$('#indiv-cond').css("background-color", "green");
				return gColors;
			}
			else{
				$('#indiv-cond').css("background-color", "red");
				return rColors;
			}
		};

		conductivityChart
			.radius(100)
			.innerRadius(75)
			.dimension(condDim)
			.group(condGroup)
			.renderLabel(true)
			.colors(getColorScale())
			.label(function (d) { return (d.key +": "+ d.value +" mg/L"); });

		conductivityChart.render();

	};
	// var cTurb = data[apiData.length-1].turbidity;

	//turbidity status is true if green/yellow and false if red
	




	$('#myChart').updatePH(recentData.pH);


	var cpH = data[apiData.length-1].pH;
	
	// true if x>=6.5, x<=8.5
	

	// Returns array of already parsed time
	// If dates are the same then return more current data

	


/********************* Thermometer *********************/ 


var cTemp = recentData.temperature;

var width = 80,
    height = 180,
    maxTemp = 80,
    minTemp = 0,
    currentTemp = cTemp;

//[red, yellow, green, yellow, red]
//[1, 10, 15, 25]
//[33.8, 50, 59, 77]
function getTempColor(){
    	if(cTemp >= 50 && cTemp <= 59){
    		$('#indiv-temp').css("background-color", "#33cc33");
    		return "#33cc33";
    	}
    	else if ((cTemp >= 34 && cTemp <= 50) || (cTemp >= 59 && cTemp <= 77)){
    		$('#indiv-temp').css("background-color", "gold");
    		return "gold";
    	}
    	else{
    		$('#indiv-temp').css("background-color", "#FF0000");
    		return "#FF0000";
    	}
    };

function getTempStat(){
	return (cTemp >= 34 && cTemp <= 77);
};


var bottomY = height - 5,
    topY = 5,
    bulbRadius = 20,
    tubeWidth = 21.5,
    tubeBorderWidth = 1,
    mercuryColor = getTempColor(),
    innerBulbColor = "rgb(230, 200, 200)"
    tubeBorderColor = "#999999";

var bulb_cy = bottomY - bulbRadius,
    bulb_cx = width/2,
    top_cy = topY + tubeWidth/2;


var svg = d3.select("#thermo")
  .attr("width", width)
  .attr("height", height);

var defs = svg.append("defs");

// Define the radial gradient for the bulb fill colour
var bulbGradient = defs.append("radialGradient")
  .attr("id", "bulbGradient")
  .attr("cx", "50%")
  .attr("cy", "50%")
  .attr("r", "50%")
  .attr("fx", "50%")
  .attr("fy", "50%");

bulbGradient.append("stop")
  .attr("offset", "90%")
  .style("stop-color", mercuryColor);


// Circle element for rounded tube top
svg.append("circle")
  .attr("r", tubeWidth/2)
  .attr("cx", width/2)
  .attr("cy", top_cy)
  .style("fill", "#FFFFFF")
  .style("stroke", tubeBorderColor)
  .style("stroke-width", tubeBorderWidth + "px");


// Rect element for tube
svg.append("rect")
  .attr("x", width/2 - tubeWidth/2)
  .attr("y", top_cy)
  .attr("height", bulb_cy - top_cy)
  .attr("width", tubeWidth)
  .style("shape-rendering", "crispEdges")
  .style("fill", "#FFFFFF")
  .style("stroke", tubeBorderColor)
  .style("stroke-width", tubeBorderWidth + "px");


// White fill for rounded tube top circle element
// to hide the border at the top of the tube rect element
svg.append("circle")
  .attr("r", tubeWidth/2 - tubeBorderWidth/2)
  .attr("cx", width/2)
  .attr("cy", top_cy)
  .style("fill", "#FFFFFF")
  .style("stroke", "none")

// Main bulb of thermometer (empty), white fill
svg.append("circle")
  .attr("r", bulbRadius)
  .attr("cx", bulb_cx)
  .attr("cy", bulb_cy)
  .style("fill", "#FFFFFF")
  .style("stroke", tubeBorderColor)
  .style("stroke-width", tubeBorderWidth + "px");


// Rect element for tube fill colour
svg.append("rect")
  .attr("x", width/2 - (tubeWidth - tubeBorderWidth)/2)
  .attr("y", top_cy)
  .attr("height", bulb_cy - top_cy)
  .attr("width", tubeWidth - tubeBorderWidth)
  .style("shape-rendering", "crispEdges")
  .style("fill", "#FFFFFF")
  .style("stroke", "none");


// Scale step size
var step = 20;

// Determine a suitable range of the temperature scale
// Fahrenheit
var domain = [
  step * Math.floor(minTemp / step),
  step * Math.ceil(maxTemp / step)
  ];

if (minTemp - domain[0] < 0.66 * step)
  domain[0] -= step;

if (domain[1] - maxTemp < 0.66 * step)
  domain[1] += step;


// D3 scale object
var scale = d3.scale.linear()
  .range([bulb_cy - bulbRadius/2 - 8.5, top_cy])
  .domain(domain);


var tubeFill_bottom = bulb_cy,
    tubeFill_top = scale(currentTemp);

// Rect element for the red mercury column
var bar = svg.append("rect")
	.attr("class", "tempRec")
	.attr("x", width/2 - (tubeWidth - 10)/2)
	.attr("y", tubeFill_top)
	.attr("width", tubeWidth - 10)
	.attr("height", 0)
	.style("shape-rendering", "crispEdges")
	.style("fill", mercuryColor)

	bar
	.transition().duration(5000)
	.attr("class", "tempRec")
	.attr("x", width/2 - (tubeWidth - 10)/2)
	.attr("y", tubeFill_top)
	.attr("width", tubeWidth - 10)
	.attr("height", tubeFill_bottom - tubeFill_top)
	.style("shape-rendering", "crispEdges")
	.style("fill", mercuryColor)


// Main thermometer bulb fill
svg.append("circle")
  .attr("r", bulbRadius - 6)
  .attr("cx", bulb_cx)
  .attr("cy", bulb_cy)
  .style("fill", "url(#bulbGradient)")
  .style("stroke", mercuryColor)
  .style("stroke-width", "2px");


// Values to use along the scale ticks up the thermometer
//Fahrenheit
var tickValues = d3.range((domain[1] - domain[0])/step + 1).map(function(v) { return domain[0] + v * step; });

// D3 axis object for the temperature scale
//Fahrenheit
var axis = d3.svg.axis()
  .scale(scale)
  .innerTickSize(7)
  .outerTickSize(0)
  .tickValues(tickValues)
  .orient("left");


// Add the axis to the image
var svgAxis = svg.append("g")
  .attr("id", "tempScale")
  .attr("transform", "translate(" + (width/2 - tubeWidth/2) + ",0)")
  .call(axis);

// Format text labels
svgAxis.selectAll(".tick text")
    .style("fill", "#E3E0E0")
    .style("font-size", "10px");

// Set main axis line to no stroke or fill
svgAxis.select("path")
  .style("stroke", "none")
  .style("fill", "none")

// Set the style of the ticks 
svgAxis.selectAll(".tick line")
  .style("stroke", tubeBorderColor)
  .style("shape-rendering", "crispEdges")
  .style("stroke-width", "1px");


/********* End Thermometer *********/ 



/********** Status ***************/


	function getpHColor(){
		if(recentData.pH >= 7.5 && recentData.pH <= 8.1){
			$('#indiv-ph').css("background-color", "green");
		}
		else if(recentData.pH >= 6.5 && recentData.pH <= 8.5){
			$('#indiv-ph').css("background-color", "gold");
		}
		else{
			$('#indiv-ph').css("background-color", "red");
		}
	}


/********** Status ***************/

	// Returns array of already parsed time
	// If dates are the same then return more current data

	$("#timeline").click( function () {
		date = timeChart.brush().extent();
		console.log(date);
		// If selected dates are the same, then nothing is selected
		// Default to most current date
		if (String(date[0]) == String(date[1])) {
			console.log("IN SAME");
			recentData = apiData[apiData.length-1];
		}
		else {
			var dataSelcted = dateDim.top(Infinity);
			recentData = dataSelcted[0];
			// console.log(dataSelcted);
		}
		$('#myChart').updatePH(recentData.pH);
		config1.maxValue = recentData.turbidity*1.3;
		gauge1.update(recentData.turbidity);
		// foo();
		updateUsage(recentData);
		updateTemp(recentData);
		cMg = recentData.magnesium;
		cNa = recentData.sodium;
		cCa = recentData.calcium;
		cTemp = recentData.temperature;
		cTurb = recentData.turbidity;
		cpH = recentData.pH;
		getTurbColor();

		
		getpHColor();
		function getTurbStat(){
    		return (cTurb <= 500);
		};
		function getpHStat(){
			return (cpH >= 6.5 && cpH <= 8.5);
		};

		function getTempStat(){
			return (cTemp >= 34 && cTemp <= 77);
		};

		function getCondStat(){
			return (cNa < 200 && ((cMg + cNa + cCa) <= 150));
		};

		function getQualStat(){
			return (getpHStat() && getTempStat() && getTurbStat() && getCondStat());
		};
	});

/********* Draw Graphs *********/ 

   // dc.renderAll();
   // dc.redrawAll();

/********* END *********/ 
	
};
/************************** Single Day Usage Bar Chart ***************************/
