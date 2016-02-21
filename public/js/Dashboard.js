//MAIN UPDATE LOOP
//MAKES SERVER REQUEST, WHICH RETURNS THE DATA TO BE USED TO CREATE THE GRAPHS
//CURRENTLY MAKES NO GRAPHS BECAUSE THERE IS NO CODE TO MAKE GRAPHS
//var requests = require("request");
$(document).ready(function() {
  $('#myChart').createPH(300, 40, 0);
  update();
});

function update() {
  queue()
    .defer(d3.json, "/api/data")
    .await(makeGraphs);

  getRecent(1, function(res) {
    $('#phLabel').html('pH: ' + res[0].pH);
    $('#myChart').updatePH(res[0].pH);
  });
}

//SET TO UPDATE EVERY 10 SECONDS
//IN THE FUTURE SHOULD UPDATE BASED ON REAL TIME FOR WHEN THE DATA IS RECEIVED
setInterval(update, 10000);


function makeGraphs(error, apiData) {
	
  //Start Transformations
	var dataSet = apiData;

	var data = [];
	for (var i = 0; i < 100; i++) {
		data.push(apiData[i]);
	}

	var dateFormat = d3.time.format("%m/%d/%Y"); //pos uneccessary
	data.forEach(function(d) {
		d.timestamp = dateFormat.parse(d.timestamp); //slow down
	});

	//Create Crossfilter instance
	// var ndx = crossfilter(dataSet);
	// var all = ndx.groupAll();

	var trial = crossfilter(data);

/******* Dimensions *******/
	var tempDim = trial.dimension(function (d) { return d.temperature; });
	var dateDim = trial.dimension(function (d) { return d.timestamp; });

/******* Groups *******/
	var turbidity = tempDim.group().reduceSum(function (d) { return d.turbidity; }); 
	var conductivity = tempDim.group().reduceSum(function (d) { return d.conductivity; }); 
	var pH = tempDim.group().reduceSum(function(d) { return d.pH; }); 
	var temp = tempDim.group().reduceSum(function (d) { return d.temperature; }); 

	/* Uncomment only one section */ 
	// var turbidity = dateDim.group().reduceSum(function (d) { return d.turbidity; }); 
	// var conductivity = dateDim.group().reduceSum(function (d) { return d.conductivity; }); 
	// var pH = dateDim.group().reduceSum(function(d) { return d.pH; }); 
	// var temp = dateDim.group().reduceSum(function (d) { return d.temperature; }); 

	//Create dimensions
	// var timestamp = ndx.dimension(function(d) { 
	// 	console.log("this is" + d.timestamp);
	// 	return d.timestamp; });

	// var tempDim = ndx.dimension(function(d) { 
	// 	console.log(d.temperature);
	// 	return d.temperature; });
	// var turbidity = tempDim.group().reduceSum(function(d) { 
	// 	console.log(d.turbidity);
	// 	return d.turbidity; }); 

	// //Create Groups
	// var temperature = timestamp.group().reduceSum(function(d) { return d.temperature; }); 
	// var turbidity = timestamp.group().reduceSum(function(d) { return scaleTurb(d.turbidity); }); 
	// var conductivity = timestamp.group().reduceSum(function(d) { return scaleCond(d.conductivity); }); 
	// var pH = timestamp.group().reduceSum(function(d) { return scalepH(d.pH); }); 
	
//RESEARCH X VS Y; date dimension; interaction
	var overalllineChart = dc.lineChart("#dc-line-chart");
	var compositeChart1 = dc.compositeChart('#chart-container1');

/******* Overlayed line chart *******/
	overalllineChart
    .width(768)
    .height(480)
    .x(d3.scale.linear().domain([0,100]))
    .interpolate('step-before')
    .renderArea(true)
    .brushOn(false)
    .renderDataPoints(true)
    .clipPadding(10)
    .yAxisLabel("This is the Y Axis")

    .dimension(tempDim)
    // .dimension(dateDim)
    
    .group(turbidity)
    .brushOn(true)
    .legend(dc.legend().x(50).y(10).itemHeight(15).gap(5))
    .stack(turbidity, 'Turbidity', function (d) {
        return d.value;
    })
    .stack(conductivity, 'Conductivity', function (d) {
    	return d.value;
    })
    .stack(pH, 'pH', function (d) {
    	return d.value;
    });
    // .stack(temp, 'Temperature', function (d) {
    // 	return d.value;
    // });


//CONDUCTIVITY PIE CHART - ERIN
	var conductivityChart = dc.pieChart("#dc-pie-chart");

	conductivityChart
	.width(250)
	.height(250)
	.radius(100)
	.innerRadius(0)
	.dimension(tempDim)
	.group(conductivity)
	.title(function (d) { return d.value; });

//Must call within composite chart object
        // .compose([
        // 	dc.lineChart(overalllineChart).group(temperature),
        // 	dc.lineChart(overalllineChart).group(turbidity),
        // 	dc.lineChart(overalllineChart).group(conductivity),
        // 	dc.lineChart(overalllineChart).group(pH)
        // 	])

	// compositeChart1
	// 	.compose([
	// 		//dc.lineChart(overalllineChart).group(temperature),
	// 		dc.lineChart(overalllineChart).group(turbidity),
	// 		dc.lineChart(overalllineChart).group(conductivity),
	// 		dc.lineChart(overalllineChart).group(pH)
	// 	])		
 //   ;

 //   var experiments = [
 //    { Run: 1, Age_19_Under: 26.9, Age_19_64: 62.3, Age_65_84: 9.8, Age_85_and_Over: 0.9 },
 //    { Run: 2, Age_19_Under: 23.5, Age_19_64: 60.3, Age_65_84: 14.5, Age_85_and_Over: 1.8 },
 //    { Run: 3, Age_19_Under: 24.3, Age_19_64: 62.5, Age_65_84: 11.6, Age_85_and_Over: 1.6 },
 //    { Run: 4, Age_19_Under: 24.6, Age_19_64: 63.3, Age_65_84: 10.9, Age_85_and_Over: 1.2 },
 //    { Run: 5, Age_19_Under: 24.5, Age_19_64: 62.1, Age_65_84: 12.1, Age_85_and_Over: 1.3 },
 //    { Run: 6, Age_19_Under: 24.7, Age_19_64: 63.2, Age_65_84: 10, Age_85_and_Over: 2.2 },
 //    { Run: 7, Age_19_Under: 25.6, Age_19_64: 58.5, Age_65_84: 13.6, Age_85_and_Over: 2.4 },
 //    { Run: 8, Age_19_Under: 24.1, Age_19_64: 61.6, Age_65_84: 12.7, Age_85_and_Over: 1.5 },
 //    { Run: 9, Age_19_Under: 24.8, Age_19_64: 59.5, Age_65_84: 13.5, Age_85_and_Over: 2.2 },
	// ];

	// var trial = crossfilter(experiments);
	// var alltrial = trial.groupAll();

	// var runDimension = trial.dimension(function (d) { return d.Run; });

	// var ageDimension = trial.dimension(function (d) { 
	// 	console.log("dim" + d.Age_19_Under);
	// 	return d.Age_19_Under; });
	// var age19To64Group = ageDimension.group().reduceSum(function (d) { 
	// 	console.log("group" + d.Age_19_64);
	// 	return d.Age_19_64; });

// 	var age19UnderGroup = runDimension.group().reduceSum(function (d) { return d.Age_19_Under; });
// 	var age19To64Group = runDimension.group().reduceSum(function (d) { return d.Age_19_64; });
// 	var age65To84Group = runDimension.group().reduceSum(function (d) { return d.Age_65_84; });
// 	var age85AndOverGroup = runDimension.group().reduceSum(function (d) { return d.Age_85_and_Over; });

// 	var overalllineChart = dc.lineChart("#dc-line-chart");
// 	var compositeChart1 = dc.compositeChart('#chart-container1');
// 	var topicTimeChart = dc.compositeChart("#topicsLineChart");

// overalllineChart
//     .width(768)
//     .height(480)
//     .x(d3.scale.linear().domain([0,20]))
//     .interpolate('step-before')
//     .renderArea(true)
//     .brushOn(false)
//     .renderDataPoints(true)
//     .clipPadding(10)
//     .yAxisLabel("This is the Y Axis!")
//     .dimension(ageDimension)
//     .group(age19To64Group);

   dc.renderAll();
   dc.redrawAll();

};
