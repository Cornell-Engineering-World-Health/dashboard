$(document).ready(function() {
  $('#myChart').createPH(300, 40, 0);
  resetDB(function(res) {
		console.log(res);
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
setInterval(update, 10000);


function makeGraphs(error, apiData) {

/********* Start Transformations *********/ 
	var dataSet = apiData;

	//Fill data array with 100 values from apiData; graphs only plot 100 values
	// most recent data is at 0 index?
	var data = [];
	for (var i = 0; i < 100; i++) {
		data.push(apiData[i]);
		console.log(apiData[i])
	}

	var dateFormat = d3.time.format("%m/%d/%Y"); //pos uneccessary
	data.forEach(function(d) {
		d.timestamp = dateFormat.parse(d.timestamp); //slow down
	});

/********* END *********/ 

/********* Create a Crossfilter instance and All *********/ 

	var trial = crossfilter(data);
	var all = trial.groupAll();

/********* END *********/ 

/********* Define Dimensions *********/ 

	// IDEAL: use dateDim - order by date
	var tempDim = trial.dimension(function (d) { return d.temperature; });
	var dateDim = trial.dimension(function (d) { return d.timestamp; });

/********* END *********/ 

/********* Groups *********/ 
/* Uncomment only one section */ 
	// var turbidity = tempDim.group().reduceSum(function (d) { return d.turbidity; }); 
	// var conductivity = tempDim.group().reduceSum(function (d) { return d.conductivity; }); 
	// var pH = tempDim.group().reduceSum(function(d) { return d.pH; }); 
	// var temp = tempDim.group().reduceSum(function (d) { return d.temperature; }); 

	var turbidity = tempDim.group().reduceSum(function (d) { return d.turbidity; }); 
	var conductivity = tempDim.group().reduceSum(function (d) { return d.conductivity; }); 
	var pH = tempDim.group().reduceSum(function(d) { return d.pH; }); 
	var temp = tempDim.group().reduceSum(function (d) { return d.temperature; }); 

/********* END *********/ 

/********* Chart Declaration *********/ 

	var overalllineChart = dc.lineChart("#dc-line-chart");
	var compositeChart1 = dc.compositeChart('#chart-container1');
	var conductivityChart = dc.pieChart("#dc-pie-chart");

/********* END *********/ 

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

	conductivityChart
		.width(250)
		.height(250)
		.radius(100)
		.innerRadius(0)
		.dimension(tempDim)
		.group(conductivity)
		// .title(function (d) { return d.value; });


/********* Draw Graphs *********/ 

   dc.renderAll();
   dc.redrawAll();

/********* END *********/ 

};