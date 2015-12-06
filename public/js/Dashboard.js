//MAIN UPDATE LOOP
//MAKES SERVER REQUEST, WHICH RETURNS THE DATA TO BE USED TO CREATE THE GRAPHS
//CURRENTLY MAKES NO GRAPHS BECAUSE THERE IS NO CODE TO MAKE GRAPHS

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

   //Start Transformations
	var dataSet = apiData;
	var dateFormat = d3.time.format("%m/%d/%Y"); //pos uneccessary
	dataSet.forEach(function(d) {
		d.timestamp = dateFormat.parse(d.timestamp); //slow down
	});

	//Create Crossfilter instance
	var ndx = crossfilter(dataSet);
	var all = ndx.groupAll()

	//Create dimensions

	var timestamp = ndx.dimension(function(d) { return d.timestamp; });
	// var temperature = ndx.dimension(function(d) { return d.temperature; });
	// var turbidity = ndx.dimension(function(d) { return d.turbidity; });
	// var conductivity = ndx.dimension(function(d) { return d.conductivity; });
	// var pH = ndx.dimension(function(d) { return d.pH; });

	//Create Groups

	// var readingsByDate = timestamp().group();
	// var readingsByTemperature = temperature().group();
	// var readingsByTurbidity = turbidity().group();
	// var readingsByConductivity = conductivity().group();
	// var readingsByPH = pH().group();
	var temperature = timestamp.group().reduceSum(function(d) { return scaleTemp(d.temperature); }); 
	var turbidity = timestamp.group().reduceSum(function(d) { return scaleTurb(d.turbidity); }); 
	var conductivity = timestamp.group().reduceSum(function(d) { return scaleCond(d.conductivity); }); 
	var pH = timestamp.group().reduceSum(function(d) { return scalepH(d.pH); }); 
	

	var overalllineChart = dc.lineChart("#dc-line-chart");
	var compositeChart1 = dc.compositeChart('#chart-container1');

	overalllineChart
		  .width(800)
        .height(200)
        .dimension(timestamp)
        .group(temperature)
        .x(d3.scale.linear().domain([0.5, 5.5]))
        .valueAccessor(function(d) {
            return d.value;
            })
        .renderHorizontalGridLines(true)
        .elasticY(true)
        .xAxis().tickFormat(function(v) {return v;}) 
        // .stack(turbidity, 'Turbidity', function (d) {
        //     return d.value;
        // })
        // .stack(conductivity, 'Conductivity', function (d) {
        //     return d.value;
        // })
        // .stack(pH, 'pH', function (d) {
        //     return d.value;
        // })

//Must call within composite chart object
        // .compose([
        // 	dc.lineChart(overalllineChart).group(temperature),
        // 	dc.lineChart(overalllineChart).group(turbidity),
        // 	dc.lineChart(overalllineChart).group(conductivity),
        // 	dc.lineChart(overalllineChart).group(pH)
        // 	])

	compositeChart1
		.compose([
			dc.lineChart(overalllineChart).group(temperature),
			dc.lineChart(overalllineChart).group(turbidity),
			dc.lineChart(overalllineChart).group(conductivity),
			dc.lineChart(overalllineChart).group(pH)
		])		
   ;


   dc.renderAll();
   dc.redrawAll();

};
