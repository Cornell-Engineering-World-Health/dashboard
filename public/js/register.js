var bad_temp = 90;
var okay_temp = 70;
var good_temp = 50;
var bad_turb = 7;
var okay_turb = 5;
var good_turb = 1;
var bad_cond = 10;
var okay_cond = 7.5;
var good_cond = 5.8;
var bad_pH = 9.5;
var okay_pH = 8.0;
var good_pH = 7.0;

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