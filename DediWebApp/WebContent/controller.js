var Controller = {};

(function(context){
	var beamline = {};
	var results = {};
	
	$(document).ready(function(){
		preferenceService.loadPreferences();
	});
	
	
	/*
	 * The main processing function that sends the data from the UI (stored in the variable beamline) 
	 * to the BeamlineConfigurationResultsServlet, waits for the results, and updates the web page with the results.
	 */
	function processInput(){
		$.get("BeamlineConfigurationResultsServlet", {configuration : JSON.stringify(beamline)}, function(data){
			results = JSON.parse(data.replace(/\"\(/g, "[").replace(/\)\"/g, "]"));
			if(results.visibleRange !== undefined) {
				results.visibleMin = results.visibleRange['min'];
				results.visibleMax = results.visibleRange['max'];
			}
			if(results.fullRange !== undefined){
				results.fullRangeMin =  results.fullRange['min'];
				results.fullRangeMax = results.fullRange['max'];
			}
			context.displayRanges(document.getElementById("scatteringQuantity").value, document.getElementById("scatteringQuantityUnit").value);
			PlottingSystem.createBeamlinePlot(beamline, document.getElementById("beamlineCanvas"), results);
			PlottingSystem.createResultsBar(beamline, document.getElementById("resultsCanvas"), results);
		});	
	}
	
	
	/*
	 * Setters.
	 */
	
	 context.setBeamlineTemplate = function() {
		beamline = JSON.parse($('#beamlineTemplatesCombo').find(':selected').val());
		
		// Populate the entire UI with the values from the template.
		$('#detectorsCombo').val(beamline.detector.detectorName);
		$('#detectorResolution').html(beamline.detector.numberOfPixelsX + " x " + beamline.detector.numberOfPixelsY);
	    $('#pixelSize').html(beamline.detector.XPixelMM + " x " + beamline.detector.YPixelMM);
		$('#bsdunit').val("mm");
		$('#bsdiameter').val(beamline.beamstopDiameter);
		$('#bsx').val(beamline.beamstopXCentre);
		$('#clearance').val(beamline.clearance);
		$('#bsy').val(beamline.beamstopYCentre);
		$('#ctdunit').val("mm");
		$('#ctdiameter').val(beamline.cameraTubeDiameter);
		$('#ctx').val(beamline.cameraTubeXCentre);
		$('#cty').val(beamline.cameraTubeYCentre);
		$('#cameraLength').attr("min", beamline.minCameraLength); 
		$('#cameraLength').attr("max", beamline.maxCameraLength); 
		$('#cameraLength').attr("step", beamline.camereLengthStepSize); 
		$('#cameraLength').val(beamline.minCameraLength); 
		beamline.cameraLength = beamline.minCameraLength;
		beamline.minEnergy = scattering.convertWavelengthToEnergy(beamline.maxWavelength, "nm", "keV");
		beamline.maxEnergy = scattering.convertWavelengthToEnergy(beamline.minWavelength, "nm", "keV");
		beamline.minWavelength = math.unit(beamline.minWavelength, "nm").toNumber("m");
		beamline.maxWavelength = math.unit(beamline.maxWavelength, "nm").toNumber("m");
		
		// Default values not included in the template
		beamline.angle = math.unit($('#angle').val(), $('#angleunit').val()).toNumber("rad");
 		$('#requestedMin').val(0);
		$('#requestedMax').val(0);
		beamline.requestedMin = 0;
		beamline.requestedMax = 0;
 	
		// Recalculate the results and update the plot.
		processInput();
	};
	
	context.setDetector = function(){
		beamline.detector = $('#detectorsCombo').find(':selected').data('info');
		$('#detectorResolution').html(beamline.detector.numberOfPixelsX + " x " + beamline.detector.numberOfPixelsY);
	    $('#pixelSize').html(beamline.detector.XPixelMM + " x " + beamline.detector.YPixelMM);
	    processInput();
	};
	
	
	context.setBeamstopDiameter = function() {
		var value = document.getElementById("bsd").value;
		beamline.beamstopDiameter = math.unit(parseFloat(value), document.getElementById("bsdunit").value).toNumber("mm");
		processInput();
	};
	
	
	context.setBeamstopXCentre = function() {
		var element = document.getElementById("bsx");
		var value = element.value
		if(isNaN(value)){
			element.value = element.oldValue;
			alert("The x position of the beamstop centre must be a number.");
			return;
		}
		beamline.beamstopXCentre = parseFloat(value);
		processInput();
	};


	context.setBeamstopYCentre = function() {
		var element = document.getElementById("bsy");
		var value = element.value;
		if(isNaN(value)){
			element.value = element.oldValue;
			alert("The y position of the beamstop centre must be a number.");
			return;
		}
		beamline.beamstopYCentre = parseFloat(value);
		processInput();
	};


	context.setClearance = function() {
		beamline.clearance = document.getElementById("clearance").value;
		processInput();
	};


	context.setCameraTubeDiameter = function() {
		var value = document.getElementById("ctdiameter").value;
		beamline.cameraTubeDiameter = math.unit(parseFloat(value), document.getElementById("ctdunit").value).toNumber("mm");
		processInput();
	};


	context.setCameraTubeXCentre = function() {
		var element = document.getElementById("ctx");
		var value = element.value;
		if(isNaN(value)){
			element.value = element.oldValue;
			alert("The x position of the camera tube centre must be a number.");
			return;
		}
		beamline.cameraTubeXCentre = parseFloat(value);
		processInput();
	};


	context.setCameraTubeYCentre = function() {
		var element = document.getElementById("cty");
		var value = element.value;
		if(isNaN(value)){
			element.value = element.oldValue;
			alert("The y position of the camera tube centre must be a number.");
			return;
		}
		beamline.cameraTubeYCentre = parseFloat(value);
		processInput();
	};


	context.setAngle = function() {
		var element = document.getElementById("angle");
		var value = element.value;
		if(isNaN(value)){
			element.value = element.oldValue;
			alert("The angle must be a number.");
			return;
		}
		beamline.angle = math.unit(parseFloat(value), document.getElementById("angleunit").value).toNumber("rad");
		processInput();
	};


	context.setCameraLength = function() {
		beamline.cameraLength = document.getElementById("cameraLength").value;
		processInput();
	};
	
	
	context.setEnergy = function() {
		var element = document.getElementById("energy");
		var unit = document.getElementById("energyunit").value;
		var maxEnergy = math.unit(beamline.maxEnergy, "keV").toNumber(unit);
		var minEnergy = math.unit(beamline.minEnergy, "keV").toNumber(unit);
		var value = element.value;
		if(isNaN(value) || value > maxEnergy || value < minEnergy){
			element.value = element.oldValue;
			alert("The energy must be a number between " + minEnergy.toFixed(3) + 
					" and " + maxEnergy.toFixed(3) + ".");
			return;
		}
		beamline.energy = math.unit(parseFloat(value), unit).toNumber("keV");
		beamline.wavelength = scattering.convertEnergyToWavelength(beamline.energy, "keV", "m");
		document.getElementById("wavelength").value = 
			math.unit(beamline.wavelength, "m").toNumber(document.getElementById("wavelengthunit").value).toFixed(3);
		processInput();
	};
	
	
	context.setWavelength = function() {
		var element = document.getElementById("wavelength");
		var unit = document.getElementById("wavelengthunit").value;
		var value = element.value;
		var maxWavelength = math.unit(beamline.maxWavelength, "m").toNumber(unit);
		var minWavelength = math.unit(beamline.minWavelength, "m").toNumber(unit);
		if(isNaN(value) || value > maxWavelength || value < minWavelength){
			element.value = element.oldValue;
			alert("The wavelength must be a number between " + minWavelength.toFixed(3) + 
				  " and " + maxWavelength.toFixed(3) + ".");
			return;
		}
		beamline.wavelength = math.unit(parseFloat(value), unit).toNumber("m");
		beamline.energy = scattering.convertWavelengthToEnergy(beamline.wavelength, "m", "keV");	
		document.getElementById("energy").value = 
			math.unit(beamline.energy, "keV").toNumber(document.getElementById("energyunit").value).toFixed(3);
		processInput();
	};

	
	context.setRequestedMin = function(){
		var element = document.getElementById("requestedMin");
		var value = element.value;
		if(isNaN(value)){
			element.value = element.oldValue;
			alert("Requested minimum must be a number.");
			return;
		}
		beamline.requestedMin = 
			scattering.convertBetweenScatteringQuantities(document.getElementById("scatteringQuantity").value, value,
					                                      document.getElementById("scatteringQuantityUnit").value, "q", "m^-1");
		checkRequestedMinMax();
		processInput();
	};
	
	
	context.setRequestedMax = function(){
		var element = document.getElementById("requestedMax");
		var value = element.value;
		if(isNaN(value)){
			element.value = element.oldValue;
			alert("Requested maximum must be a number.");
			return;
		}
		beamline.requestedMax = 
			scattering.convertBetweenScatteringQuantities(document.getElementById("scatteringQuantity").value, value,
					                                      document.getElementById("scatteringQuantityUnit").value, "q", "m^-1");
		checkRequestedMinMax();
		processInput();
	};
	
	
	function checkRequestedMinMax(){
		if(beamline.requestedMax !== undefined && beamline.requestedMin !== undefined
		   && !isNaN(beamline.requestedMin) && !isNaN(beamline.requestedMax) && beamline.requestedMin > beamline.requestedMax){
			var temp = beamline.requestedMin;
			beamline.requestedMin = beamline.requestedMax;
			beamline.requestedMax = temp;
		}
	}
	
	context.displayRanges = function(quantity, unit){
		var minVisible = results.visibleMin;
		var maxVisible = results.visibleMax;
		if(minVisible !== undefined && maxVisible !== undefined){
			var convertedMinVisible = scattering.convertBetweenScatteringQuantities("q", minVisible, "m^-1", quantity, unit);
		    var convertedMaxVisible = scattering.convertBetweenScatteringQuantities("q", maxVisible, "m^-1", quantity, unit);
		    document.getElementById("visibleMin").innerHTML = Math.min(convertedMinVisible, convertedMaxVisible).toFixed(3);
		    document.getElementById("visibleMax").innerHTML =  Math.max(convertedMinVisible, convertedMaxVisible).toFixed(3);
		}
				
		var minRequested = beamline.requestedMin;
		var maxRequested = beamline.requestedMax;
		var convertedMinRequested = 
			scattering.convertBetweenScatteringQuantities("q", minRequested, "m^-1", quantity, unit);
		var convertedMaxRequested = 
			scattering.convertBetweenScatteringQuantities("q", maxRequested, "m^-1", quantity, unit);
		document.getElementById("requestedMin").value = Math.min(convertedMinRequested, convertedMaxRequested).toFixed(3);
		document.getElementById("requestedMax").value = Math.max(convertedMinRequested, convertedMaxRequested).toFixed(3);	
	}
	
	
	/*
	 * Functions for processing unit and quantity changes.
	 */
	
	context.bsDiameterUnitChanged = function(){
		document.getElementById("bsdiameter").value = 
			math.unit(beamline.beamstopDiameter, "mm").toNumber(document.getElementById("bsdunit").value).toFixed(2);
	};
	
	
	context.ctDiameterUnitChanged = function(){
		document.getElementById("ctdiameter").value = 
			math.unit(beamline.cameraTubeDiameter, "mm").toNumber(document.getElementById("ctdunit").value).toFixed(2);
	};
	
	
	context.angleUnitChanged = function(){
		if(beamline.angle != undefined){
			document.getElementById("angle").value = 
				math.unit(beamline.angle, "rad").toNumber(document.getElementById("angleunit").value).toFixed(2);
		}
	};
	

	context.energyUnitChanged = function(){
		if(beamline.energy != undefined){
			document.getElementById("energy").value = 
				math.unit(beamline.energy, "keV").toNumber(document.getElementById("energyunit").value).toFixed(3);
		}
	};
	
	
	context.wavelengthUnitChanged = function(){
		if(beamline.wavelength != undefined){
			document.getElementById("wavelength").value = 
				math.unit(beamline.wavelength, "m").toNumber(document.getElementById("wavelengthunit").value).toFixed(3);
		}
	};
	
})(Controller);
