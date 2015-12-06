var register = require("./register.js");


	// scaleTemp will scale the temperature to a number between 0 to 100 based on water quality quotas
	function scaleTemp (temp){
		if (temp > register.bad_temp()) {
			return 100;
		}
		else if (temp <= register.bad_temp() && temp >= register.okay_temp()){
			return ((100 - 50) * (temp - register.okay_temp()) / (register.bad_temp() - register.okay_temp())) + 50;
		}
		else if (temp < register.okay_temp() && temp >= register.good_temp()){
			return ((50 - 0) * (temp - register.good_temp()) / (register.okay_temp() - register.good_temp()));
		}
		else {
			return 0;
		}
	}
	// scaleTurb will scale the turbidity to a number between 0 to 100 based on water quality quotas
	function scaleTurb (turb){
		if (turb > register.bad_turb()) {
			return 100;
		}
		else if (turb <= register.bad_turb() && turb >= register.okay_turb()){
			return ((100 - 50) * (turb - register.okay_turb()) / (register.bad_turb() - register.okay_turb())) + 50;
		}
		else if (turb < register.okay_turb() && turb >= register.good_turb()) {
			return ((50 - 0) * (turb - register.good_turb()) / (register.okay_turb() - register.good_turb()));
		}
		else {
			return 0;
		}
	}
	// scaleCond will scale the conductivity to a number between 0 to 100 based on water quality quotas
	function scaleCond (cond){
		if (cond > register.bad_cond()) {
			return 100;
		}
		else if (cond <= register.bad_cond() && cond >= register.okay_cond()){
			return ((100 - 50) * (cond - register.okay_cond()) / (register.bad_cond() - register.okay_cond())) + 50;
		}
		else if (cond < register.okay_cond() && cond >= register.good_cond()) {
			return ((50 - 0) * (cond - register.good_cond()) / (register.okay_cond() - register.good_cond()));
		}
		else 
		{
			return 0;
		}
	}
	// scalepH will scale the pH to a number between 0 to 100 based on water quality quotas
	function scalepH (pH){
		if (pH > register.bad_pH()) {
			return 100;
		}
		else if (pH <= register.bad_pH() && pH >= register.okay_pH()){
			return ((100 - 50) * (pH - register.okay_pH()) / (register.bad_pH() - register.okay_pH())) + 50;
		}
		else if (pH < register.okay_pH() && pH >= register.good_pH()) {
			return ((50 - 0) * (pH - register.good_pH()) / (register.okay_pH() - register.good_pH()));
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

	function changeBackground(temp, turb, cond, pH) {
		if (scaleTemp (temp) >= 100 || scaleTurb (turb) >= 100 || 
			scaleCond (cond) >= 100 || scalepH (pH) >= 100){
			document.body.style.background = "#e60000";
		}
		else if (scaleTemp (temp) >= 50  || scaleTurb (turb) >= 50 || 
			scaleCond (cond) >= 50 || scalepH (pH) >= 50){
			document.body.style.background = "#ffff66";
		}
		else{
			document.body.style.background = "green";
		}
			
	}

		

		