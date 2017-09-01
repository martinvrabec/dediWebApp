var controller = {};

(function(context){
	var beamline = {};
	var results = {};
	
	var offsetX = 0;
	var offsetY = 0;
	
	$(document).ready(function(){
		// Populate the UI with default values that are not part of the preferences service
		$('#angleunit').val("deg");
		$('#angle').val(90);
		$('#requestedMin').val(0);
		$('#requestedMax').val(0);
		// Note there is no default for energy and wavelength, the fields are left blank by default
		
		
		// Load preferences from the preferences service
		preferenceService.loadPreferences();
		
		
		// Register some event handlers
		$('input[name="mask"]').click(function() {
			redrawConfigurationPlot();
		});
		
		$('input[name="axes"]').click(function() {
			redrawConfigurationPlot();
		});
		
		$('input[name="zoom"]').click(function() {
			redrawConfigurationPlot();
		});
		
		$('input[type="number"]').keydown(function() {
			return false;
		});
		
		var canvasX = 0;
		var canvasY = 0;
		
		$("#beamlineCanvas")[0].addEventListener("mousedown", canvasMouseDown, false);
		$("#beamlineCanvas")[0].addEventListener("mouseup", canvasMouseUp, false);
		
		function canvasMouseDown(event){
			canvasX = event.pageX;
			canvasY = event.pageY;
		}
		
		function canvasMouseUp(event){
			offsetX += event.pageX - canvasX;
			offsetY += event.pageY - canvasY;
			redrawConfigurationPlot();
		}
		
		$('input[name="axes"]').prop('disabled', true);
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
			redrawConfigurationPlot();
			plottingSystem.createResultsBar(beamline, document.getElementById("resultsCanvas"), results);
		});	
		
		if(beamline.wavelength === undefined) $('input[name="axes"]').prop('disabled', true);
		else $('input[name="axes"]').prop('disabled', false);
	}
	
	
	function redrawConfigurationPlot(){
		plottingSystem.createBeamlinePlot(beamline, $("#beamlineCanvas")[0], results, 
				$('input[name="axes"]').is(':checked'), $('input[name="mask"]').is(':checked'), 
				$('input[name="zoom"]').val()/100, offsetX, offsetY);
	}
	
	
	/*
	 * Setters.
	 */
	
	 context.setBeamlineTemplate = function() {
		// Save user-entered values that are not part of the template.
		var energy = beamline.energy;
		var wavelength = beamline.wavelength;
		
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
		
		// Default values not included in the template
		beamline.cameraLength = beamline.minCameraLength;
		$('#cameraLength').val(beamline.cameraLength); 
		beamline.minEnergy = scattering.convertWavelengthToEnergy(beamline.maxWavelength, "nm", "keV");
		beamline.maxEnergy = scattering.convertWavelengthToEnergy(beamline.minWavelength, "nm", "keV");
		beamline.minWavelength = math.unit(beamline.minWavelength, "nm").toNumber("m");
		beamline.maxWavelength = math.unit(beamline.maxWavelength, "nm").toNumber("m");
		
		// Restore user-entered values
		beamline.energy = energy;
		beamline.wavelength = wavelength;
		beamline.angle = math.unit($('#angle').val(), $('#angleunit').val()).toNumber("rad");
		beamline.requestedMin = 
			scattering.convertBetweenScatteringQuantities($("#scatteringQuantity").val(), $('#requestedMin').val(),
	                   $("#scatteringQuantityUnit").val(), "q", "m^-1");
		beamline.requestedMax = 
			scattering.convertBetweenScatteringQuantities($("#scatteringQuantity").val(), $('#requestedMax').val(),
                   $("#scatteringQuantityUnit").val(), "q", "m^-1");
 	
		// Recalculate the results and update the plot.
		processInput();
	};
	
	
	context.setDetector = function(){
		beamline.detector = $('#detectorsCombo').find(':selected').data('info');
		$('#detectorResolution').html(beamline.detector.numberOfPixelsX + " x " + beamline.detector.numberOfPixelsY);
	    $('#pixelSize').html(beamline.detector.XPixelMM + " x " + beamline.detector.YPixelMM);
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
		if(isNaN(value) || value < 0){
			element.value = element.oldValue;
			alert("Requested minimum must be a non-negative number.");
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
		if(isNaN(value) || value < 0){
			element.value = element.oldValue;
			alert("Requested maximum must be a non-negative number.");
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
		} else {
			 document.getElementById("visibleMin").innerHTML = "";
			 document.getElementById("visibleMax").innerHTML = "";
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
	 * Functions for processing unit changes.
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
	
})(controller);
