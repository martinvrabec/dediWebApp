/**
 * Module for plotting the beamline configuration and the results of q-range computations.
 * To (re)draw the plot, invoke the public method createBeamlinePlot on the plottingSystem object.
 * To (re)draw the results bar, invoke the public method createResultsBar on the plottingSystem object.
 */

var plottingSystem = {};

(function(context){
	
	/*
	 * Private utility methods.
	 */
	
	function clearPlot(colour, ctx, canvas){
		ctx.fillStyle = colour;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	
	
	function drawLine(x1, y1, x2, y2, colour, ctx){
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = colour;
		ctx.stroke();
	}
	
	
	function drawEllipse(major, minor, x, y, colour, ctx){
		ctx.beginPath();
		ctx.ellipse(x, y, major, minor, 0, 0, 2 * Math.PI);
		ctx.fillStyle = colour;
		ctx.fill();
	}
	
	
	function drawCircle(radius, x, y, colour, ctx){
		ctx.beginPath();
		ctx.arc(x, y, radius, 0 , 2*Math.PI);
	    ctx.fillStyle = colour;
	    ctx.fill();
	}
	
	
	
	context.createBeamlinePlot = (function(){
		/*
		 * Private fields.
		 */
		var beamline = {};
		var results = {};
		var canvas = {};
		var ctx = {};
		var scaleFactor = 1;
		var offsetX = 0;
		var offsetY = 0;
		var zoom = 1;
		var axesPlotted = false;
		var maskPlotted = false;
		
		/*
		 * Private methods.
		 */
		function drawDetector(){
			ctx.fillStyle = "blue";
			ctx.fillRect(0, 0, beamline.detector.numberOfPixelsX*scaleFactor, beamline.detector.numberOfPixelsY*scaleFactor);
		}

		
		function drawBeamstop(){
			var x = beamline.beamstopXCentre*scaleFactor;
			var y = beamline.beamstopYCentre*scaleFactor;
			var majorPixels = beamline.beamstopDiameter/2/beamline.detector.XPixelMM;
			var major = scaleFactor*majorPixels;
			var majorWithClearance = scaleFactor*(parseFloat(majorPixels) + parseInt(beamline.clearance));
			var minorPixels = beamline.beamstopDiameter/2/beamline.detector.YPixelMM;
			var minor = scaleFactor*minorPixels;
			var minorWithClearance = scaleFactor*(parseFloat(minorPixels) + parseInt(beamline.clearance));
			
			drawEllipse(majorWithClearance, minorWithClearance, x, y, "grey", ctx);
			drawEllipse(major, minor, x, y, "black", ctx);
		}


		function drawCameraTube(){
			var x = beamline.cameraTubeXCentre*scaleFactor;
			var y = beamline.cameraTubeYCentre*scaleFactor;
			var majorPixels = beamline.cameraTubeDiameter/2/beamline.detector.XPixelMM;
			var major = scaleFactor*majorPixels;
			var minorPixels = beamline.cameraTubeDiameter/2/beamline.detector.YPixelMM;
			var minor = scaleFactor*minorPixels;
			
			drawEllipse(major, minor, x, y, "rgba(245, 245, 220, 0.7)", ctx);
		}
		
		
		function drawRay(){
			if(results.visibleRangeStartPoint === undefined || results.visibleRangeEndPoint === undefined) return;
			
			var visibleStartX = results.visibleRangeStartPoint[0]*scaleFactor/beamline.detector.XPixelMM;
			var visibleStartY = results.visibleRangeStartPoint[1]*scaleFactor/beamline.detector.YPixelMM;
			var visibleEndX = results.visibleRangeEndPoint[0]*scaleFactor/beamline.detector.XPixelMM;
			var visibleEndY = results.visibleRangeEndPoint[1]*scaleFactor/beamline.detector.YPixelMM;
			
			ctx.lineWidth = 2;
			drawLine(beamline.beamstopXCentre*scaleFactor, beamline.beamstopYCentre*scaleFactor, 
					visibleStartX, visibleStartY, "red", ctx);
			
			if(results.requestedRangeStartPoint !== undefined && results.requestedRangeEndPoint !== undefined 
				&& results.isSatisfied){
				var requestedStartX = results.requestedRangeStartPoint[0]*scaleFactor/beamline.detector.XPixelMM;
				var requestedStartY = results.requestedRangeStartPoint[1]*scaleFactor/beamline.detector.YPixelMM;
				var requestedEndX = results.requestedRangeEndPoint[0]*scaleFactor/beamline.detector.XPixelMM;
				var requestedEndY = results.requestedRangeEndPoint[1]*scaleFactor/beamline.detector.YPixelMM;
				
				drawLine(visibleStartX, visibleStartY, requestedStartX, requestedStartY, "orange", ctx);
				drawLine(requestedStartX, requestedStartY, requestedEndX, requestedEndY, "green", ctx);
				drawLine(requestedEndX, requestedEndY, visibleEndX, visibleEndY, "orange", ctx);
			}	
			else drawLine(visibleStartX, visibleStartY, visibleEndX, visibleEndY, "orange", ctx);
		}
		
		
		function drawAxes(){
			if(beamline.wavelength === undefined || beamline.cameraLength === undefined)
				return;
			
			ctx.fillStyle = "black";
			ctx.font = "14px Arial";
			
			var x0 = beamline.beamstopXCentre*scaleFactor;
			var y0 = beamline.beamstopYCentre*scaleFactor;
			
			var step = beamline.wavelength*beamline.cameraLength*1e12/(2*Math.PI);
			var dx = scaleFactor*step/beamline.detector.XPixelMM;
			var dy = scaleFactor*step/beamline.detector.YPixelMM;
			var width = canvas.width - offsetX;
			var height = canvas.height - offsetY;
			
			var i = Math.ceil((-offsetX - x0)/dx);
			var colour;
			while(x0 + i*dx < width){
				if(i == 0) colour = "black";
				else colour = "#e9e9e9";
				drawLine(x0 + i*dx, height, x0 + i*dx, -offsetY, colour, ctx);
				if(i != 0){
					drawLine(x0 + i*dx, y0 - 10, x0 + i*dx, y0 + 10, "black", ctx);
					ctx.fillText(i, x0 + i*dx, y0 -15); 
				}
				i++;
			}
			
			i = Math.ceil((-offsetY - y0)/dy);
			while(y0 + i*dy < canvas.height - offsetY){
				if(i == 0) colour = "black";
				else colour = "#e9e9e9";
				drawLine(-offsetX, y0 + i*dy, width, y0 + i*dy, colour, ctx);
				if(i != 0){
					drawLine(x0 - 10, y0 + i*dy, x0 + 10, y0 + i*dy, "black", ctx);
					ctx.fillText(i, x0 + 15, y0 + i*dy); 
				}
				i++;
			}
		}
				
		
		function redrawPlot(){
			if(beamline === undefined || beamline.detector === undefined){
				clearPlot("black", ctx, canvas);
				return;
			}
			var maxSide = Math.max(beamline.detector.numberOfPixelsX, beamline.detector.numberOfPixelsY);
			scaleFactor = 800/maxSide;
			canvas.width = beamline.detector.numberOfPixelsX*scaleFactor;
			canvas.height = beamline.detector.numberOfPixelsY*scaleFactor;
			scaleFactor *= zoom;
			ctx = canvas.getContext("2d");
			clearPlot("grey", ctx, canvas);
			ctx.translate(offsetX, offsetY);
			drawDetector();
			drawCameraTube();
			if(axesPlotted) drawAxes();
			drawBeamstop();
			drawRay();
		}
		
		
		/*
		 * Returned public function.
		 */
		return function(bl, cvs, res, ap = false, mp = false, 
                        zm = zoom, offX = offsetX, offY = offsetY){
			beamline = bl;
			results = res;
			canvas = cvs;
			offsetX = offX;
			offsetY = offY;
			zoom = zm;
			axesPlotted = ap;
			maskPlotted = mp;
			redrawPlot();
		};
	})();
	
	
	context.createResultsBar = (function() {
		/*
		 * Private fields.
		 */
		var beamline = {};
		var results = {};
		var canvas = {};
		var ctx = {};
		
		
		/*
		 * Private method.
		 */
		function drawResultsBar(){
			if(!results.hasSolution){
				ctx.fillStyle = "black";
				ctx.font = "16px Arial";
				ctx.fillText("No solution", canvas.width/2 - 50, canvas.height/2); 
				return;
			}
			if(!results.isSatisfied)
				ctx.fillStyle = "red";
			else 
				ctx.fillStyle = "green"
					
		   var offset = canvas.width/100;
		   var slope = (canvas.width-2*offset)/ (Math.log(results.fullRangeMax) - Math.log(results.fullRangeMin));
	       var minRequestedX = slope*(Math.log(beamline.requestedMin) - Math.log(results.fullRangeMin)) + offset;
	       var maxRequestedX = slope*(Math.log(beamline.requestedMax) - Math.log(results.fullRangeMin)) + offset;
	       var minValueX = slope*(Math.log(results.visibleMin) - Math.log(results.fullRangeMin)) + offset;
		   var maxValueX = slope*(Math.log(results.visibleMax) - Math.log(results.fullRangeMin)) + offset;
		   
		   if(maxRequestedX > canvas.width - offset) maxRequestedX = canvas.width - offset;
		   if(minRequestedX > canvas.width - offset) minRequestedX = canvas.width - offset;
		   
		   ctx.fillRect(minValueX, canvas.height/3, maxValueX - minValueX, canvas.height/3);
		   ctx.lineWidth = 2;
		   drawLine(minRequestedX, 5, minRequestedX, canvas.height, "black", ctx);
		   drawLine(maxRequestedX, 5, maxRequestedX, canvas.height, "black", ctx);
		}
		
		
		/*
		 * Returned public function.
		 */
		return function(bl, cvs, res){
			beamline = bl;
			results = res;
			canvas = cvs;
			ctx = canvas.getContext("2d");
			clearPlot("white", ctx, canvas);
			drawResultsBar();
		};
	})();
	
})(plottingSystem);
