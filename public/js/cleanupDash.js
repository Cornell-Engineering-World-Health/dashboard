function update() {
  queue()
    .defer(d3.json, "/api/data")
    .await(makeGraphs);
}
update();
//SET TO UPDATE EVERY 10 SECONDS
//IN THE FUTURE SHOULD UPDATE BASED ON REAL TIME FOR WHEN THE DATA IS RECEIVED
setInterval(update, 10000);

getRecent(2);

function makeGraphs(error, apiData) {
	
/********* Graph Calculation Functions *********/ 
	var badtemp = 90;
	var okaytemp = 70;
	var goodtemp = 50;
	var badturb = 7;
	var okayturb = 5;
	var goodturb = 1;
	var badcond = 10;
	var okaycond = 7.5;
	var goodcond = 5.8;
	var badpH = 9.5;
	var okaypH = 8.0;
	var goodpH = 7.0;
	function scaleTemp (temp){
		if (temp > badtemp) {
			return 100;
		}
		else if (temp <= badtemp && temp >= okaytemp){
			return ((100 - 50) * (temp - okaytemp) / (badtemp - okaytemp)) + 50;
		}
		else if (temp < okaytemp && temp >= goodtemp){
			return ((50 - 0) * (temp - goodtemp) / (okaytemp - goodtemp));
		}
		else {
			return 0;
		}
	}
	function scaleTurb (turb){
		if (turb > badturb) {
			return 100;
		}
		else if (turb <= badturb && turb >= okayturb){
			return ((100 - 50) * (turb - okayturb) / (badturb - okayturb)) + 50;
		}
		else if (turb < okayturb && turb >= goodturb) {
			return ((50 - 0) * (turb - goodturb) / (okayturb - goodturb));
		}
		else {
			return 0;
		}
	}
	function scaleCond (cond){
		if (cond > badcond) {
			return 100;
		}
		else if (cond <= badcond && cond >= okaycond){
			return ((100 - 50) * (cond - okaycond) / (badcond - okaycond)) + 50;
		}
		else if (cond < okaycond && cond >= goodcond) {
			return ((50 - 0) * (cond - goodcond) / (okaycond - goodcond));
		}
		else 
		{
			return 0;
		}
	}
	function scalepH (pH){
		if (pH > badpH) {
			return 100;
		}
		else if (pH <= badpH && pH >= okaypH){
			return ((100 - 50) * (pH - okaypH) / (badpH - okaypH)) + 50;
		}
		else if (pH < okaypH && pH >= goodpH) {
			return ((50 - 0) * (pH - goodpH) / (okaypH - goodpH));
		}
		else {
			return 0;
		}
	}
    function waterQuality (temp, turb, cond, pH){
    	return ((scaleTemp (temp) + scaleTurb (turb) + scaleCond (cond) + scalepH (pH))/4);
    }
/********* Graph Calculation Functions END *********/ 

/********* Start Transformations *********/ 
	var dataSet = apiData;

	var dateFormat = d3.time.format("%m/%d/%Y"); //pos uneccessary; already formatted?
	data.forEach(function(d) {
		d.timestamp = dateFormat.parse(d.timestamp); //slow down
	});

	//Fill data array with 100 values from apiData; graphs only plot 100 values
	// most recent data is at 0 index?
	var data = [];
	for (var i = 0; i < 100; i++) {
		data.push(apiData[i]);
	}

/********* END *********/ 

/********* Create a Crossfilter instance and All *********/ 

	var readings = crossfilter(data);
	var all = readings.groupAll();

/********* END *********/ 

/********* Define Dimensions *********/ 

	// IDEAL: use dateDim - order by date
	var tempDim = readings.dimension(function (d) { return d.temperature; });
	var dateDim = readings.dimension(function (d) { return d.timestamp; });

/********* END *********/ 

/********* Groups *********/ 
/* Uncomment only one section */ 
	// var turbidity = tempDim.group().reduceSum(function (d) { return d.turbidity; }); 
	// var conductivity = tempDim.group().reduceSum(function (d) { return d.conductivity; }); 
	// var pH = tempDim.group().reduceSum(function(d) { return d.pH; }); 
	// var temp = tempDim.group().reduceSum(function (d) { return d.temperature; }); 

	var turbidity = dateDim.group().reduceSum(function (d) { return d.turbidity; }); 
	var conductivity = dateDim.group().reduceSum(function (d) { return d.conductivity; }); 
	var pH = dateDim.group().reduceSum(function(d) { return d.pH; }); 
	var temp = dateDim.group().reduceSum(function (d) { return d.temperature; }); 


/********* END *********/ 

/********* Chart Declaration *********/ 

	var overalllineChart = dc.lineChart("#dc-line-chart");
	var compositeChart1 = dc.compositeChart('#chart-container1');

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





/********* Draw Graphs *********/ 

   dc.renderAll();
   dc.redrawAll();

/********* END *********/ 

};