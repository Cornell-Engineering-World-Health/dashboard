var date;
$(document).ready(function() {
	// setTimeout(function() {
	// 	$( "#temperature" ).trigger( "click" );
	// }, 0);
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

function updateTemp(temp) {
	$("#thermo").empty();
	var cTemp = temp;

	var width = 80,
	    height = 180,
	    maxTemp = 80,
	    minTemp = 0,
	    currentTemp = cTemp;


	var bottomY = height - 5,
	    topY = 5,
	    bulbRadius = 20,
	    tubeWidth = 21.5,
	    tubeBorderWidth = 1,
	    mercuryColor = getTempColor(cTemp),
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
	 // console.log(domain);
	 // console.log([bulb_cy - bulbRadius/2 - 8.5, top_cy]);


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

	    {timestamp: "2015-11-13T02:00:00Z", usage: 4},
	    {timestamp: "2015-11-13T04:00:00Z", usage: 6},
	    {timestamp: "2015-11-13T06:00:00Z", usage: 8},
	    {timestamp: "2015-11-13T08:00:00Z", usage: 10},
	    {timestamp: "2015-11-13T10:00:00Z", usage: 12},
	    {timestamp: "2015-11-13T12:00:00Z", usage: 18},
	    {timestamp: "2015-11-13T14:00:00Z", usage: 25},
	    {timestamp: "2015-11-13T16:00:00Z", usage: 16},
	    {timestamp: "2015-11-13T18:00:00Z", usage: 10},
	    {timestamp: "2015-11-13T20:00:00Z", usage: 9},
	    {timestamp: "2015-11-13T22:00:00Z", usage: 8},
	    {timestamp: "2015-11-13T23:59:00Z", usage: 5},

	    {timestamp: "2015-11-14T02:00:00Z", usage: 5},
	    {timestamp: "2015-11-14T04:00:00Z", usage: 8},
	    {timestamp: "2015-11-14T06:00:00Z", usage: 9},
	    {timestamp: "2015-11-14T08:00:00Z", usage: 10},
	    {timestamp: "2015-11-14T10:00:00Z", usage: 17},
	    {timestamp: "2015-11-14T12:00:00Z", usage: 25},
	    {timestamp: "2015-11-14T14:00:00Z", usage: 30},
	    {timestamp: "2015-11-14T16:00:00Z", usage: 18},
	    {timestamp: "2015-11-14T18:00:00Z", usage: 16},
	    {timestamp: "2015-11-14T20:00:00Z", usage: 10},
	    {timestamp: "2015-11-14T22:00:00Z", usage: 8},
	    {timestamp: "2015-11-14T23:59:00Z", usage: 6},

	    {timestamp: "2015-11-15T02:00:00Z", usage: 5},
	    {timestamp: "2015-11-15T04:00:00Z", usage: 9},
	    {timestamp: "2015-11-15T06:00:00Z", usage: 10},
	    {timestamp: "2015-11-15T08:00:00Z", usage: 13},
	    {timestamp: "2015-11-15T10:00:00Z", usage: 16},
	    {timestamp: "2015-11-15T12:00:00Z", usage: 20},
	    {timestamp: "2015-11-15T14:00:00Z", usage: 21},
	    {timestamp: "2015-11-15T16:00:00Z", usage: 26},
	    {timestamp: "2015-11-15T18:00:00Z", usage: 21},
	    {timestamp: "2015-11-15T20:00:00Z", usage: 20},
	    {timestamp: "2015-11-15T22:00:00Z", usage: 10},
	    {timestamp: "2015-11-15T23:59:00Z", usage: 4},

	    {timestamp: "2015-11-16T02:00:00Z", usage: 6},
	    {timestamp: "2015-11-16T04:00:00Z", usage: 8},
	    {timestamp: "2015-11-16T06:00:00Z", usage: 9},
	    {timestamp: "2015-11-16T08:00:00Z", usage: 11},
	    {timestamp: "2015-11-16T10:00:00Z", usage: 15},
	    {timestamp: "2015-11-16T12:00:00Z", usage: 18},
	    {timestamp: "2015-11-16T14:00:00Z", usage: 16},
	    {timestamp: "2015-11-16T16:00:00Z", usage: 17},
	    {timestamp: "2015-11-16T18:00:00Z", usage: 14},
	    {timestamp: "2015-11-16T20:00:00Z", usage: 11},
	    {timestamp: "2015-11-16T22:00:00Z", usage: 10},
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
		if (_isSelectedDay(d)) {
		return d;} });

	//get y-axis
	var usageGroup = singleDayFilter.group().reduceSum(dc.pluck('usage'));

	//set MIN MAX X-AXIS
	var singleDayMinDate = singleDayFilter.bottom(1)[0].timestamp;
	// var singleDayMinDate = singleDayFilter.bottom(1)[0];
	var singleDayMaxDate = singleDayFilter.top(1)[0].timestamp;

	//graph code
	//var usageBarChart  = dc.barChart("#usage-bar-chart"); 
	usageBarChart
	  .width(700).height(400).gap(20)
	  .centerBar(true)
	  .dimension(singleDayFilter)
	  .group(usageGroup)
	  .x(d3.time.scale().domain([singleDayMinDate,singleDayMaxDate]))
	  .brushOn(false)
	  .yAxisLabel("Well Usage")
	  .renderHorizontalGridLines(true)
	  .renderVerticalGridLines(true)
	  .xUnits(function(){return BAR_GRAPH_THICKNESS;});

	usageBarChart.render();
}

function makeGraphs(error, apiData) {

/********* Start Transformations *********/ 

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
	});


/********* END *********/ 

/********* Create a Crossfilter instance and All *********/ 

	var trial = crossfilter(apiData);
	var all = trial.groupAll();

	var dataCross = crossfilter(data);
	var all = dataCross.groupAll();

/********* END *********/ 

/********* Define Dimensions *********/ 
	// Dimensions are only for later filters (construct a dim on type and apply filters on type)

	// Later use dateDim to sort based on certain dates
	// var tempDim = trial.dimension(function (d) { return d.temperature; });
	var dateDim = trial.dimension(function (d) { return d.timestamp; });
	var minDate = dateDim.bottom(1)[0].timestamp;
	var maxDate = dateDim.top(1)[0].timestamp;

	// var dataDateDim = dataCross.dimension(function (d) { return d.timestamp; });


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
	var usageMain = dateDim.group().reduceSum(function (d) { return +d.usage; });
	// var usage = dateDim2.group().reduceSum(function (d) { return +d.usage; });

/********* END *********/ 

/********* Chart Declaration *********/ 

	var timeChart  = dc.barChart("#timeline");
	var lineChart = dc.lineChart("#dc-line-chart");
	var compositeChart1 = dc.lineChart('#chart-container1');
	var conductivityChart = dc.pieChart("#dc-pie-chart");
	var usagelineChart = dc.lineChart("#dc-usage-graph");
	var conductivityPie = dc.pieChart("#conductivity-pie-chart");
	var yearRingChart   = dc.pieChart("#chart-ring-year");

	var usageBarChart = dc.barChart("#usage-bar-chart");

	var lineW = 868;
	var lineH = 480;

/********* END *********/ 

/******* Overlayed line chart *******/
	updateUsage(recentData);
	getPHColor(recentData.pH);
	updateCond(recentData);

	lineChart
		.width(lineW)
	    .height(lineH)
	    .x(d3.time.scale().domain([minDate, maxDate]))
	    .margins({top: 30, right: 50, bottom: 25, left: 60})
	    .brushOn(false)
	    .clipPadding(10)
	    .yAxisLabel("Fahrenheit")
	    .elasticY(true)
	    .renderLabel(true)
	    .ordinalColors(["#E4572E"])
	    .rangeChart(timeChart)
	    .dimension(dateDim)
	    .group(temp)
	    .renderHorizontalGridLines(true)
	    .renderVerticalGridLines(true)
  lineChart.render();

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
				    .yAxisLabel("Fahrenheit")
				    .elasticY(true)
				    .renderLabel(true)
				    .ordinalColors(["#E4572E"])
				    .rangeChart(timeChart)
				    .dimension(dateDim)
				    .renderHorizontalGridLines(true)
	    			.renderVerticalGridLines(true)
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
				    .yAxisLabel("mg/L")
				    .elasticY(true)
				    .renderLabel(true)
				    .ordinalColors(["#FFC914"])
				    .rangeChart(timeChart)
				    .dimension(dateDim)
				    .renderHorizontalGridLines(true)
	    			.renderVerticalGridLines(true)
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
				    .yAxisLabel("uS/cm")
				    .elasticY(true)
				    .renderLabel(true)
				    .ordinalColors(["#17BEBB"])
				    .rangeChart(timeChart)
				    .dimension(dateDim)
				    .renderHorizontalGridLines(true)
	    			.renderVerticalGridLines(true)
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
				    .elasticY(true)
				    .renderLabel(true)
				    .ordinalColors(["#76B041"])
				    .rangeChart(timeChart)
				    .dimension(dateDim)
				    .renderHorizontalGridLines(true)
	    			.renderVerticalGridLines(true)
	    			.yAxisLabel("")
				    .group(pH);
				lineChart.render();
				break;
			// TODO: No fake data
			case "usage":
				timeChart.filterAll();
				timeChart.render();
				lineChart
					.width(868)
				    .height(480)
				    .x(d3.time.scale().domain([minDate, maxDate]))
				    .margins({top: 30, right: 50, bottom: 25, left: 60})
				    .brushOn(false)
				    .clipPadding(10)
				    .yAxisLabel("Liters")
				    .elasticY(true)
				    .renderLabel(true)
				    .rangeChart(timeChart)
				    .dimension(dateDim)
				    .ordinalColors(["#9975b9"])
					.renderHorizontalGridLines(true)
	    			.renderVerticalGridLines(true)
				    .group(usageMain);
				lineChart.render();
				break;
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
	    .showYAxis(false) // Self-defined changed dc.js
	timeChart.render();


	conductivityPie
	    .width(768)
	    .height(480)
	    .dimension(dateDim)
	    .group(conductivity)
	    .innerRadius(50);
	// yearRingChart
	//     .dimension(dateDim)
	//     .group(conductivity)
	//     .innerRadius(145);
	// yearRingChart.render();


	/*************** TURBIDITY GRAPH ***************/

	var cTurb = data[apiData.length-1].turbidity;


	

	// function getTurbColor(){
 //    	if(cTurb <= 500){
 //    		$('#indiv-turb').css("background-color", "#86b266");
 //    		return "#86b266";
 //    	}
 //    	else{
 //    		$('#indiv-turb').css("background-color", "#e32645");
 //    		return "#e32645";
 //    	}
 //    };

	var config1 = liquidFillGaugeDefaultSettings();
	config1.waveColor = getTurbColor(cTurb);
	config1.circleColor = getTurbColor(cTurb);
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



		conductivityChart
			.radius(100)
			.innerRadius(75)
			.dimension(condDim)
			.group(condGroup)
			.renderLabel(true)
			.colors(getCondColor(cNa, cMg, cCa))
			.label(function (d) { return (d.key +": "+ d.value +" mg/L"); });

		conductivityChart.render();

	};

	$('#myChart').updatePH(recentData.pH);


	var cpH = data[apiData.length-1].pH;


	// Returns array of already parsed time
	// If dates are the same then return more current data

	


/********************* Thermometer *********************/ 


var cTemp = recentData.temperature;

var width = 80,
    height = 180,
    maxTemp = 80,
    minTemp = 0,
    currentTemp = cTemp;


updateTemp(recentData.temperature);





/********** Status ***************/

	// Returns array of already parsed time
	// If dates are the same then return more current data

	$("#timeline").click( function () {
		date = timeChart.brush().extent();
		// If selected dates are the same, then nothing is selected
		// Default to most current date
		// if (String(date[0]) == String(date[1])) {
		// 	console.log("IN SAME");
		// 	recentData = apiData[apiData.length-1];
		// }
		// else {
		var dataSelcted = dateDim.top(Infinity);
		recentData = dataSelcted[0];
		// }

		$('#myChart').updatePH(recentData.pH);
		config1.maxValue = recentData.turbidity*1.3;
		gauge1.update(recentData.turbidity);
		updateTemp(recentData.temperature);
		updateCond(recentData);
		cMg = recentData.magnesium;
		cNa = recentData.sodium;
		cCa = recentData.calcium;
		cTemp = recentData.temperature;
		cTurb = recentData.turbidity;
		cpH = recentData.pH;
		config1.waveColor = getTurbColor(cTurb);
		config1.circleColor = getTurbColor(cTurb);


		getPHColor(recentData.pH);
		updateUsage(recentData);
	});

	/********* Tool Tips *********/ 
	var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) { 
      	console.log(d);
      	return '<span>' + d.total + '</span>' + ' entries' 
      })
      .offset([-12, 0])

    vis = d3.select('#dc-line-chart')
    	.append('svg')
    	.attr('width', lineW)
    	.attr('height', lineH)
    vis.call(tip)


/********* Draw Graphs *********/ 

   // dc.renderAll();
   // dc.redrawAll();

/********* END *********/ 
	
};
/************************** Single Day Usage Bar Chart ***************************/
