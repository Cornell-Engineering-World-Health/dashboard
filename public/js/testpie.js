var chart = dc.pieChart("#test");
var data1 = [ 
  { 'Expt': 1, 'Run': 1, 'Speed': 850, 'title': 'Title1'  }, 
  { 'Expt': 1, 'Run': 2, 'Speed': 740, 'title': 'Title2'  }, 
  { 'Expt': 1, 'Run': 3,  'Speed': 900, 'title': 'Title3' }, 
  { 'Expt': 1, 'Run': 4, 'Speed': 1070, 'title': 'Title4' }
];
	var ndx = crossfilter(data1);
	var runD = ndx.dimension( function (d) {
		return d.title
	});
	speedGroup = runD.group.reduceSum( function (d) {
		return d.Speed * d.Run;
	});

	chart
	    .width(568)
	    .height(580)
	    .slicesCap(4)
	    .innerRadius(10)
	    .dimension(runDimension)
	    .group(speedSumGroup) // by default, pie charts will use group.key as the label
	    .renderLabel(true)
	    .label(function (d) {
	      return d.key.toUpperCase();
    });
chart.render();