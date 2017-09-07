var controller = {};

(function(context){
	var beamline = {};
	var results = {};
	var plottingSystem = {};  // plotting system for the beamline configuration plot
	
	
	$("#beamlineCanvas").ready(function(){
		plottingSystem = plottingService.createBeamlinePlottingSystem($("#beamlineCanvas"));
	})
	
	
	$(document).ready(function(){
		// Populate the UI with default values that are not part of the preferences 
		$('#angleunit').val("deg");
		$('#angle').val(90);
		$('#requestedMin').val(0);
		$('#requestedMax').val(0);
		// Note there is no default for energy and wavelength, the fields are left blank by default
		
		
		// Prevent users from typing into spinner widgets
		$('input[type="number"]').keydown(function() {
			return false;
		});
		
		
		// Load preferences from the preference service
		preferenceService.loadBeamlinePreferences(function(beamlines){
	        	if(beamlines.length == 0) console.log("The server did not return any beamline configuration templates.");
	            else {
	            	var beamline = beamlines[0];
	            	var beamlineTemplatesCombo = $('#beamlineTemplatesCombo');
	            	jQuery.each(beamlines, function(){
		                $('<option/>', {
		                    'value': JSON.stringify(this),
		                    'text': this.name
		                }).appendTo(beamlineTemplatesCombo);
		            });
	                $('#beamlineTemplatesCombo').val(JSON.stringify(beamline)).change();
	            }
		});
	});
	
	
	/*
	 * The main processing function that sends the data obtained from the UI (stored in the variable beamline) 
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
			context.displayRanges($("#scatteringQuantity").val(), $("#scatteringQuantityUnit").val());
			plottingSystem.updatePlot(beamline, results);
			plottingService.createResultsBar(beamline, results, $("#resultsCanvas")[0]);
		});	
	}
	
	
	
	/*
	 * Setters.
	 */
	
	 context.setBeamlineTemplate = function() {
		// Store user-entered energy and wavelength
		var energy = beamline.energy;
		var wavelength = beamline.wavelength;
		 
		beamline = JSON.parse($('#beamlineTemplatesCombo').find(':selected').val());
		
		
		// Populate the entire UI with the values from the template.
		$('#detectorsCombo').find('option').remove();
		jQuery.each(beamline.detectors, function(){
            $('<option/>', {
                'value': this.detectorName,
                'text': this.detectorName,
                'data-info': JSON.stringify(this)
            }).appendTo('#detectorsCombo');
        });
		if(beamline.detectors.length == 0) console.log("The selected beamline template is not associated with any detectors");
        else {
			beamline.detector = beamline.detectors[0];
			$('#detectorsCombo').val(beamline.detector.detectorName);
			$('#detectorResolution').html(beamline.detector.numberOfPixelsX + " x " + beamline.detector.numberOfPixelsY);
		    $('#pixelSize').html(beamline.detector.XPixelMM + " x " + beamline.detector.YPixelMM);
        }
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
		$('#cameraLength').attr("step", beamline.cameraLengthStepSize); 
		
		// Default values not included in the template
		beamline.cameraLength = beamline.minCameraLength;
		$('#cameraLength').val(beamline.cameraLength); 
		beamline.minEnergy = scattering.convertWavelengthToEnergy(beamline.maxWavelength, "nm", "keV");
		beamline.maxEnergy = scattering.convertWavelengthToEnergy(beamline.minWavelength, "nm", "keV");
		beamline.minWavelength = math.unit(beamline.minWavelength, "nm").toNumber("m");
		beamline.maxWavelength = math.unit(beamline.maxWavelength, "nm").toNumber("m");
		
		// Re-get user-entered values
		beamline.angle = math.unit($('#angle').val(), $('#angleunit').val()).toNumber("rad");
		beamline.requestedMin = 
			scattering.convertBetweenScatteringQuantities($("#scatteringQuantity").val(), $('#requestedMin').val(),
	                   $("#scatteringQuantityUnit").val(), "q", "m^-1");
		beamline.requestedMax = 
			scattering.convertBetweenScatteringQuantities($("#scatteringQuantity").val(), $('#requestedMax').val(),
                   $("#scatteringQuantityUnit").val(), "q", "m^-1");
 	
		// Reset energy and wavelength
		if(energy == undefined || energy > beamline.maxEnergy || energy < beamline.minEnergy){
			$('#energy').val("");
			$('#wavelength').val("");
		} else {
			beamline.energy = energy;
			beamline.wavelength = wavelength;
		}
		
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
		var element = $("#bsx")[0];
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
		var element = $("#bsy")[0];
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
		beamline.clearance = $("#clearance").val();
		processInput();
	};


	context.setCameraTubeXCentre = function() {
		var element = $("#ctx")[0];
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
		var element = $("#cty")[0];
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
		var element = $("#angle")[0];
		var value = element.value;
		if(isNaN(value)){
			element.value = element.oldValue;
			alert("The angle must be a number.");
			return;
		}
		beamline.angle = math.unit(parseFloat(value), $("#angleunit").val()).toNumber("rad");
		processInput();
	};


	context.setCameraLength = function() {
		beamline.cameraLength = $("#cameraLength").val();
		processInput();
	};
	
	
	context.setEnergy = function() {
		var element = $("#energy")[0];
		var unit = $("#energyunit").val();
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
		$("#wavelength").val(math.unit(beamline.wavelength, "m").toNumber($("#wavelengthunit").val()).toFixed(3));
		processInput();
	};
	
	
	context.setWavelength = function() {
		var element = $("#wavelength")[0];
		var unit = $("#wavelengthunit").val();
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
		$("#energy").val(math.unit(beamline.energy, "keV").toNumber($("#energyunit").val()).toFixed(3));
		processInput();
	};

	
	context.setRequestedMin = function(){
		var element = $("#requestedMin")[0];
		var value = element.value;
		if(isNaN(value) || value < 0){
			element.value = element.oldValue;
			alert("Requested minimum must be a non-negative number.");
			return;
		}
		beamline.requestedMin = 
			scattering.convertBetweenScatteringQuantities($("#scatteringQuantity").val(), value,
					                                      $("#scatteringQuantityUnit").val(), "q", "m^-1");
		checkRequestedMinMax();
		processInput();
	};
	
	
	context.setRequestedMax = function(){
		var element = $("#requestedMax")[0];
		var value = element.value;
		if(isNaN(value) || value < 0){
			element.value = element.oldValue;
			alert("Requested maximum must be a non-negative number.");
			return;
		}
		beamline.requestedMax = 
			scattering.convertBetweenScatteringQuantities($("#scatteringQuantity").val(), value,
					                                      $("#scatteringQuantityUnit").val(), "q", "m^-1");
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
		    $("#visibleMin").html(Math.min(convertedMinVisible, convertedMaxVisible).toFixed(3));
		    $("#visibleMax").html(Math.max(convertedMinVisible, convertedMaxVisible).toFixed(3));
		} else {
			$("#visibleMin").html("");
			$("#visibleMax").html("");
		}
				
		var minRequested = beamline.requestedMin;
		var maxRequested = beamline.requestedMax;
		var convertedMinRequested = 
			scattering.convertBetweenScatteringQuantities("q", minRequested, "m^-1", quantity, unit);
		var convertedMaxRequested = 
			scattering.convertBetweenScatteringQuantities("q", maxRequested, "m^-1", quantity, unit);
		$("#requestedMin").val(Math.min(convertedMinRequested, convertedMaxRequested).toFixed(3));
		$("#requestedMax").val(Math.max(convertedMinRequested, convertedMaxRequested).toFixed(3));	
	}
	
	
	/*
	 * Functions for processing unit changes.
	 */
	
	context.bsDiameterUnitChanged = function(){
		$("#bsdiameter").val(math.unit(beamline.beamstopDiameter, "mm").toNumber($("#bsdunit").val()).toFixed(2));
	};
	
	
	context.ctDiameterUnitChanged = function(){
		$("#ctdiameter").val(math.unit(beamline.cameraTubeDiameter, "mm").toNumber($("#ctdunit").val()).toFixed(2));
	};
	
	
	context.angleUnitChanged = function(){
		$("#angle").val(math.unit(beamline.angle, "rad").toNumber($("#angleunit").val()).toFixed(2));
	};
	

	context.energyUnitChanged = function(){
		if(beamline.energy != undefined){
			$("#energy").val(math.unit(beamline.energy, "keV").toNumber($("#energyunit").val()).toFixed(3));
		}
	};
	
	
	context.wavelengthUnitChanged = function(){
		if(beamline.wavelength != undefined){
			$("#wavelength").val(math.unit(beamline.wavelength, "m").toNumber($("#wavelengthunit").val()).toFixed(3));
		}
	};
	
})(controller);
