/**
 * Module for plotting the beamline configuration.
 * To (re)draw the plot, invoke the public method updatePlot() on the PlottingSystem object.
 */

var PlottingSystem = {};

(function(context){
	/*
	 * Private fields.
	 */
	var beamline = {};
	var results = {};
	var canvas = {};
	var ctx = {};
	var scaleFactor = 1;
	
	
	/*
	 * Private methods.
	 */
	
	function drawLine(x1, y1, x2, y2, colour){
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = colour;
		ctx.stroke();
	}
	
	
	function drawCircle(radius, x, y, colour){
		ctx.beginPath();
		ctx.arc(x, y, radius, 0 , 2*Math.PI);
	    ctx.fillStyle = colour;
	    ctx.fill();
	}


	function drawBeamstop(){
		var x = beamline.beamstopXCentre*scaleFactor;
		var y = beamline.beamstopYCentre*scaleFactor;
		var radiusPixels = beamline.beamstopDiameter/2/beamline.detector.XPixelMM;
		var radius = scaleFactor*radiusPixels;
		var radiusWithClearance = scaleFactor*(parseFloat(radiusPixels) + parseInt(beamline.clearance));
		
		drawCircle(radiusWithClearance, x, y, "grey");
		drawCircle(radius, x, y, "black");
	}


	function drawCameraTube(){
		var x = beamline.cameraTubeXCentre*scaleFactor;
		var y = beamline.cameraTubeYCentre*scaleFactor;
		var diameterPixels = beamline.cameraTubeDiameter/2/beamline.detector.XPixelMM;
		var diameter = scaleFactor*diameterPixels;
		
		drawCircle(diameter, x, y, "white");
	}
	
	
	function drawRay(){
		var visibleStartX = results.visibleRangeStartPoint[0]*scaleFactor/beamline.detector.XPixelMM;
		var visibleStartY = results.visibleRangeStartPoint[1]*scaleFactor/beamline.detector.XPixelMM;
		var visibleEndX = results.visibleRangeEndPoint[0]*scaleFactor/beamline.detector.XPixelMM;
		var visibleEndY = results.visibleRangeEndPoint[1]*scaleFactor/beamline.detector.XPixelMM;
		drawLine(beamline.beamstopXCentre*scaleFactor, beamline.beamstopYCentre*scaleFactor, 
				visibleStartX, visibleStartY, "red");
		drawLine(visibleStartX, visibleStartY, visibleEndX, visibleEndY, "brown");
	}
	
	
	function drawAxes(){
		
	}
	
	
	/*
	 * Public methods.
	 */
	
	context.updatePlot = function(bl, cvs, res){
		beamline = bl;
		results = res;
		canvas = cvs
		if(beamline === undefined || beamline.detector === undefined) return;
		var maxSide = Math.max(beamline.detector.numberOfPixelsX, beamline.detector.numberOfPixelsY);
		scaleFactor = 500/maxSide;
		canvas.width = beamline.detector.numberOfPixelsX*scaleFactor;
		canvas.height = beamline.detector.numberOfPixelsY*scaleFactor;
		canvas.style = "background-color:blue";
		ctx = canvas.getContext("2d");
		drawCameraTube();
		drawBeamstop();
		drawRay();
		drawAxes();
	};
	
})(PlottingSystem);
