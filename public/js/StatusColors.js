//Color Declarations
var greenMain = "#86b266";
var yellowMain = "#ecbd62"
var redMain = "#e32645"
var gColors = d3.scale.ordinal().range(["#376515", "#6f9751", "#acbe9f"]);
//var yColors = d3.scale.ordinal().range(["#a67d2c", "#d1a858", "#ebd2a1"]);
var rColors = d3.scale.ordinal().range(["#e53552", "#f76f6f", "#f9afaf"]);

//Change color of temperature label and thermometer 
function getTempColor(cTemp){
	if(cTemp >= 50 && cTemp <= 59){
		$('#indiv-temp').css("background-color", greenMain);
		return greenMain;
	}
	else if ((cTemp >= 34 && cTemp <= 50) || (cTemp >= 59 && cTemp <= 77)){
		$('#indiv-temp').css("background-color", yellowMain);
		return yellowMain;
	}
	else{
		$('#indiv-temp').css("background-color", redMain);
		return redMain;
	}
};

function getTurbColor(cTurb){
    if(cTurb <= 500){
        $('#indiv-turb').css("background-color", greenMain);
        return greenMain;
    }
    else{
        $('#indiv-turb').css("background-color", redMain);
        return redMain;
    }
};

function getCondColor(cNa, cMg, cCa){
    if(cNa < 200 && ((cMg + cNa + cCa) <= 150)){
        $('#indiv-cond').css("background-color", greenMain);
        return gColors;
    }
    else{
        $('#indiv-cond').css("background-color", redMain);
        return rColors;
    }
};


function getPHColor(cPH){
    if(cPH >= 7.5 && cPH <= 8.1){
        $('#indiv-ph').css("background-color", greenMain);
        return greenMain;
    }
    else if(cPH >= 6.5 && cPH <= 8.5){
        $('#indiv-ph').css("background-color", yellowMain);
        return yellowMain;
    }
    else{
        $('#indiv-ph').css("background-color", redMain);
        return redMain;
    }
};



function getQualStat(cTemp, cTurb, cNa, cMg, cCa, cpH){
    if(getTempColor(cTemp) ==  redMain || getTurbColor(cTurb) == redMain || getCondColor(cNa, cMg, cCa) == rColors 
        || getPHColor(cpH) == redMain){
        return redMain;
    }
    else if (getTempColor(cTemp) ==  yellowMain || getTurbColor(cTurb) == yellowMain || 
        getPHColor(cpH) == yellowMain){

        return yellowMain;
    }
    else{
        return greenMain;
    }
};