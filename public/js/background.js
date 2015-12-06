
var register = require('./register.js');


	var badtemp = register.bad_temp();
	console.log(badtemp.toString());

	var okaytemp = register.okay_temp();
	console.log(okaytemp.toString());
	
	var goodtemp = register.good_temp();
	console.log(goodtemp.toString());
	
	var badturb = register.bad_turb();
	console.log(badturb.toString());
	
	var okayturb = register.okay_turb();
	console.log(okayturb.toString());
	
	var goodturb = register.good_turb();
	console.log(goodturb.toString());
	
	var badcond = register.bad_cond();
	console.log(badcond.toString());
	
	var okaycond = register.okay_cond();
	console.log(okaycond.toString());
	
	var goodcond = register.good_cond();
	console.log(goodcond.toString());
	
	var badpH = register.bad_pH();
	console.log(badpH.toString());
	
	var okaypH = register.okay_pH();
	console.log(okaypH.toString());
	
	var goodpH = register.good_pH(); 
	console.log(goodpH.toString());

// scaleTemp will scale the temperature to a number between 0 to 100 based on water quality quotas
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
	// scaleTurb will scale the turbidity to a number between 0 to 100 based on water quality quotas
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
	// scaleCond will scale the conductivity to a number between 0 to 100 based on water quality quotas
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
	// scalepH will scale the pH to a number between 0 to 100 based on water quality quotas
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

	//waterQuality will calculate an average of all the scaled values of temperature, turbidity, conductivity, and pH
	function waterQuality (temp, turb, cond, pH){
		return ((scaleTemp (temp) + scaleTurb (turb) + 
			scaleCond (cond) + scalepH (pH))/4);
	}

	function getColor(temp, turb, cond, pH) {
		if (scaleTemp (temp) >= 100 || scaleTurb (turb) >= 100 || 
			scaleCond (cond) >= 100 || scalepH (pH) >= 100){
			//document.body.style.background = "#e60000";
			return "red";
		}
		else if (scaleTemp (temp) >= 50  || scaleTurb (turb) >= 50 || 
			scaleCond (cond) >= 50 || scalepH (pH) >= 50){
			//document.body.style.background = "#e60000";
			return "#e60000";
		}
		else{
			//document.body.style.background = "green";
			return "green";
		}
			
	}
	console.log(scaleTemp(badtemp));
	console.log(scaleTurb(badturb));
	console.log(scaleCond(badcond));
	console.log(scalepH(badpH));
	console.log(getColor(100,100,100,100));

		

		