var Controller = {};

(function(context){
	var beamline = {};
	
	
	/*
	 * The main processing function that sends the data from the UI (stored in the variable beamline) 
	 * to the BeamlineConfigurationResultsServlet, waits for the results, and updates the web page with the results.
	 */
	function processInput(){
		$.get("BeamlineConfigurationResultsServlet", {configuration : JSON.stringify(beamline)}, function(data){
			var results = JSON.parse(data.replace(/\"\(/g, "[").replace(/\)\"/g, "]"));
			PlottingSystem.updatePlot(beamline, document.getElementById("canvas"), results);
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
		$('#angleunit').val("deg");
		$('#angle').val(90);
		beamline.angle = Conversions.convertToRadians(90, "deg");
		
		// Recalculate the results and update the plot.
		processInput();
	}
	
	context.setDetector = function(){
		beamline.detector = $('#detectorsCombo').find(':selected').data('info');
		$('#detectorResolution').html(beamline.detector.numberOfPixelsX + " x " + beamline.detector.numberOfPixelsY);
	    $('#pixelSize').html(beamline.detector.XPixelMM + " x " + beamline.detector.YPixelMM);
	    processInput();
	};
	
	
	context.setBeamstopDiameter = function() {
		var value = document.getElementById("bsdiameter").value;
		if(isNaN(value)) {
			alert("Beamstop diameter must be a number.");
			beamline.beamstopDiameter = 0;
			return;
		}
		beamline.beamstopDiameter = Conversions.convertToMillimetres(parseFloat(value), 
				                                document.getElementById("bsdunit").value);
		processInput();
	};
	
	
	context.setBeamstopXCentre = function() {
		var value = document.getElementById("bsx").value;
		if(isNaN(value)){
			alert("The x position of the beamstop centre must be a number.");
			beamline.beamstopXCentre = 0;
			return;
		}
		beamline.beamstopXCentre = parseFloat(value);
		processInput();
	};


	context.setBeamstopYCentre = function() {
		var value = document.getElementById("bsy").value;
		if(isNaN(value)){
			alert("The y position of the beamstop centre must be a number.");
			beamline.beamstopYCentre = 0;
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
		if(isNaN(value)) {
			alert("Camera tube diameter must be a number.");
			beamline.cameraTubeDiameter = 0;
			return;
		}
		beamline.cameraTubeDiameter = Conversions.convertToMillimetres(parseFloat(value), 
													   document.getElementById("ctdunit").value);
		processInput();
	};


	context.setCameraTubeXCentre = function() {
		var value = document.getElementById("ctx").value;
		if(isNaN(value)){
			alert("The x position of the camera tube centre must be a number.");
			beamline.cameraTubeXCentre = 0;
			return;
		}
		beamline.cameraTubeXCentre = parseFloat(value);
		processInput();
	};


	context.setCameraTubeYCentre = function() {
		var value = document.getElementById("cty").value;
		if(isNaN(value)){
			alert("The y position of the camera tube centre must be a number.");
			beamline.cameraTubeYCentre = 0;
			return;
		}
		beamline.cameraTubeYCentre = parseFloat(value);
		processInput();
	};


	context.setAngle = function() {
		var value = document.getElementById("angle").value;
		beamline.angle = Conversions.convertToRadians(parseFloat(value), 
									  document.getElementById("angleunit").value);
		processInput();
	};


	context.setCameraLength = function() {
		beamline.cameraLength = document.getElementById("cameraLength").value;
		processInput();
	};
	
	
	context.setEnergy = function() {
		var value = document.getElementById("energy").value;
		if(isNaN(value)){
			alert("The energy must be a number.");
			beamline.wavelength = 0;
			document.getElementById("wavelength").value = 0;
			return;
		}
		var energy = Conversions.convertTokeV(parseFloat(value), document.getElementById("energyunit").value);
		beamline.wavelength = Conversions.convertEnergyToWavelength(energy, "keV", "m");
		document.getElementById("wavelength").value = 
			Conversions.convertFromMillimeters(beamline.wavelength*1e3, document.getElementById("wavelengthunit").value);
		processInput();
	};
	
	
	context.setWavelength = function() {
		alert("Setting wavelength");
		var value = document.getElementById("wavelength").value;
		if(isNaN(value)){
			alert("The wavelength must be a number.");
			beamline.wavelength = 0;
			document.getElementById("energy").value = 0;
			return;
		}
		beamline.wavelength = Conversions.convertToMillimetres(parseFloat(value), 
				                                               document.getElementById("wavelengthunit").value)*1e-3;
		document.getElementById("energy").value = 
		processInput();
	};

	
	
	/*
	 * Functions for processing unit and quantity changes.
	 */
	
	context.bsDiameterUnitChanged = function(){
		document.getElementById("bsdiameter").value = 
			Conversions.convertFromMillimetres(beamline.beamstopDiameter, document.getElementById("bsdunit").value);
	};
	
	
	context.ctDiameterUnitChanged = function(){
		document.getElementById("ctdiameter").value = 
			Conversions.convertFromMillimetres(beamline.cameraTubeDiameter, document.getElementById("ctdunit").value);
	};
	
	
	context.angleUnitChanged = function(){
		if(beamline.angle != undefined){
			document.getElementById("angle").value = 
				Conversions.convertFromRadians(beamline.angle, document.getElementById("angleunit").value);
		}
	};
	
	
	context.energyUnitChanged = function(){
		if(beamline.energy != undefined){
			document.getElementById("energy").value = 
				Conversions.convertFromkeV(beamline.energy, document.getElementById("energyunit").value);
		}
	};
	
	
	context.wavelengthUnitChanged = function(){
		if(beamline.wavelength != undefined){
			alert("Changing unit");
			document.getElementById("wavelength").value = 
				Conversions.convertFromMillimeters(beamline.wavelength*1e3, document.getElementById("wavelengthunit").value);
		}
	};
})(Controller);
