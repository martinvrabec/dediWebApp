/**
 * Module for plotting the beamline configuration and the results of q-range computations.
 * To (re)draw the plot, invoke the public method createBeamlinePlot on the plottingSystem object.
 * To (re)draw the results bar, invoke the public method createResultsBar on the plottingSystem object.
 */

var plottingService = {};

(function(module){
	
	/*
	 * General private utility methods.
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
	
	
	function drawEllipseOutline(major, minor, x, y, colour, ctx){
		ctx.beginPath();
		ctx.ellipse(x, y, major, minor, 0, 0, 2 * Math.PI);
		ctx.strokeStyle = colour;
		ctx.stroke();
	}
	
	
	function drawCircle(radius, x, y, colour, ctx){
		ctx.beginPath();
		ctx.arc(x, y, radius, 0 , 2*Math.PI);
	    ctx.fillStyle = colour;
	    ctx.fill();
	}
	
	
	function drawCircleOutline(radius, x, y, colour, ctx){
		ctx.beginPath();
		ctx.arc(x, y, radius, 0 , 2*Math.PI);
		ctx.strokeStyle = colour;
		ctx.stroke();
	}
	
	
	module.createBeamlinePlottingSystem = (function(){
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
			
			try{
				drawEllipse(majorWithClearance, minorWithClearance, x, y, "grey", ctx);
				drawEllipse(major, minor, x, y, "black", ctx);
			} catch(e){
				drawCircle(majorWithClearance, x, y, "grey", ctx);
				drawCircle(major, x, y, "black", ctx);
			}
		}


		function drawCameraTube(){
			var x = beamline.cameraTubeXCentre*scaleFactor;
			var y = beamline.cameraTubeYCentre*scaleFactor;
			var majorPixels = beamline.cameraTubeDiameter/2/beamline.detector.XPixelMM;
			var major = scaleFactor*majorPixels;
			var minorPixels = beamline.cameraTubeDiameter/2/beamline.detector.YPixelMM;
			var minor = scaleFactor*minorPixels;
			
			try{
				drawEllipse(major, minor, x, y, "rgba(245, 245, 220, 0.7)", ctx);
			} catch(e){
				drawCircle(major, x, y, "rgba(245, 245, 220, 0.7)", ctx);
			}
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
		
		
		function drawMask(){
			var missingModules = beamline.detector.missingModules;
			var xGap = beamline.detector.XGap*scaleFactor;
			var yGap = beamline.detector.YGap*scaleFactor;
			var numberOfHorizontalModules = beamline.detector.numberOfHorizontalModules;
			var numberOfVerticalModules = beamline.detector.numberOfVerticalModules;
			
			if(!xGap || !yGap || !numberOfHorizontalModules || !numberOfVerticalModules) return;
			
			var detectorWidth = beamline.detector.numberOfPixelsX*scaleFactor;
			var detectorHeight = beamline.detector.numberOfPixelsY*scaleFactor;
            var moduleWidth = (detectorWidth - (numberOfHorizontalModules-1)*xGap)/
							   numberOfHorizontalModules;
            var moduleHeight = (detectorHeight - (numberOfVerticalModules-1)*yGap)/
			                    numberOfVerticalModules;
            var i;
            var j;
            ctx.lineWidth = xGap;
            for(i = moduleWidth, j = 1; j < numberOfHorizontalModules; i += moduleWidth + xGap, j++)
            	drawLine(i, 0, i, detectorHeight, "purple", ctx);
            
            ctx.lineWidth = yGap;
            for(i = moduleHeight, j = 1; j < numberOfVerticalModules; i += moduleHeight + yGap, j++)
            	drawLine(0, i, detectorWidth, i, "purple", ctx);
            
            if(!missingModules) return;
            for(i in missingModules){
            	var index = missingModules[i];
            	var xIndex = index % numberOfHorizontalModules;
            	var yIndex = Math.floor(index/numberOfHorizontalModules); 
            	var x = xIndex*(moduleWidth + xGap) - xGap;
            	var y = yIndex*(moduleHeight + yGap) - yGap;
            	ctx.fillStyle = "purple";
        		ctx.fillRect(x, y, moduleWidth + xGap, moduleHeight + yGap);
            }
		}
		
		
		function drawAxes(){
			if(beamline.wavelength === undefined || beamline.cameraLength === undefined)
				return;
			
			ctx.fillStyle = "black";
			ctx.font = "14px Arial";
			
			var x0 = beamline.beamstopXCentre*scaleFactor;
			var y0 = beamline.beamstopYCentre*scaleFactor;
			
			var valueStep = math.unit(1, "nm^-1").toNumber($('#qUnitsCombo').val());
			var step = 1e3*beamline.wavelength*beamline.cameraLength/(2*Math.PI)*math.unit(valueStep, $('#qUnitsCombo').val()).toNumber("m^-1");
			
			var dx = scaleFactor*step/beamline.detector.XPixelMM;
			var dy = scaleFactor*step/beamline.detector.YPixelMM;
			var width = canvas.width - offsetX;
			var height = canvas.height - offsetY;
			
			ctx.lineWidth = 1;
			var i = Math.ceil((-offsetX - x0)/dx);
			var colour;
			while(x0 + i*dx < width){
				if(i == 0) colour = "black";
				else colour = "#e9e9e9";
				drawLine(x0 + i*dx, height, x0 + i*dx, -offsetY, colour, ctx);
				if(i != 0){
					drawLine(x0 + i*dx, y0 - 10, x0 + i*dx, y0 + 10, "black", ctx);
					ctx.fillText((i*valueStep).toFixed(2), x0 + i*dx, y0 -15); 
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
					ctx.fillText((i*valueStep).toFixed(2), x0 + 15, y0 + i*dy); 
				}
				i++;
			}
		}
				
		
		function drawCalibrants(){
			var calibrant = JSON.parse($('#calibrantsCombo').val());
			var x = beamline.beamstopXCentre*scaleFactor;
			var y = beamline.beamstopYCentre*scaleFactor;
			for(var i in calibrant.HKLs){
				var d = calibrant.HKLs[i].DNano;
				var q = scattering.convertBetweenScatteringQuantities("d", d, "nm", "q", "m^-1");
				var distanceMM = scattering.calculateDistanceFromQValue(q, beamline.cameraLength, beamline.wavelength)*1e3;
				var majorPixels = distanceMM/beamline.detector.XPixelMM;
				var major = scaleFactor*majorPixels;
				var minorPixels = distanceMM/beamline.detector.YPixelMM;
				var minor = scaleFactor*minorPixels;
				
				try{
					drawEllipseOutline(major, minor, x, y, "black", ctx);
				} catch(e){
					drawCircleOutline(major, x, y, "black", ctx);
				}
			}
		}
		
		
		/**
		 * Redraws the entire plot.
		 */
		function redrawPlot(){
			if(beamline === undefined || beamline.detector === undefined){
				clearPlot("black", ctx, canvas);
				return;
			}
			var maxSide = Math.max(beamline.detector.numberOfPixelsX, beamline.detector.numberOfPixelsY);
			scaleFactor = 800/maxSide;
			canvas.width = beamline.detector.numberOfPixelsX*scaleFactor;
			canvas.height = beamline.detector.numberOfPixelsY*scaleFactor;
			scaleFactor *= $('input[name="zoom"]').val()/100;
			ctx = canvas.getContext("2d");
			clearPlot("grey", ctx, canvas);
			ctx.translate(offsetX, offsetY);
			drawDetector();
			drawCameraTube();
			drawBeamstop();
			if($('input[name="mask"]').is(':checked')) drawMask();
			if($('input[name="axes"]').is(':checked')) drawAxes();
			if($('input[name="calibrants"]').is(':checked')) drawCalibrants();
			drawRay();
		}
		
		
		/**
		 * Creates any controls needed to configure the plot.
		 */
		function createPlotControls(cvs){
			cvs.after('<div class="textPanel" id="plotConfigurationPanel"></div>');
			var panel = $('#plotConfigurationPanel');
			panel.append('<label> Zoom: </label> <input name="zoom" type="number" min="10" step="10" value="100"><br/>');
			panel.append('<input type="checkbox" name="axes"> Show axes (in q ');	 
			panel.append('<select id="qUnitsCombo"></select>');
			var qUnitsCombo = $('#qUnitsCombo');
			jQuery.each(scattering.getUnitsFor("q"), function(){
		                $('<option/>', {
		                    'value': this.unit,
		                    'text': this.label
		                }).appendTo(qUnitsCombo);
		            });
			panel.append(') <br/>');
			panel.append('<input type="checkbox" name="mask"> Plot detector mask <br>');
			panel.append('<input type="checkbox" name="calibrants"> Show calibrant rings for ');
			panel.append('<select id="calibrantsCombo"></select>');
			preferenceService.loadCalibrants(function(calibrants){
				if(calibrants.length == 0) console.log("The server did not return any calibrants.");
	            else {
	            	var calibrantsCombo = $('#calibrantsCombo');
	            	jQuery.each(calibrants, function(){
		                $('<option/>', {
		                    'value': JSON.stringify(this),
		                    'text': this.name
		                }).appendTo(calibrantsCombo);
		            });
	            }
			});
		}
		
		
		/**
		 * Registers event handlers for events on the canvas and in the plot controls.
		 */
		function registerEventHandlers(){
			$("#plotConfigurationPanel input, #plotConfigurationPanel select").on("click change", redrawPlot);
			
			var canvasX = 0;
			var canvasY = 0;
			
			canvas.addEventListener("mousedown", function(event){
				canvasX = event.pageX;
				canvasY = event.pageY;
			}, false);
			
			
			canvas.addEventListener("mouseup", function(event){
				offsetX += event.pageX - canvasX;
				offsetY += event.pageY - canvasY;
				redrawPlot();
			}, false);
			
			
			canvas.addEventListener('mousewheel', updateZoom, false);
			canvas.addEventListener('DOMMouseScroll', updateZoom, false);
			
			
			function updateZoom(event){
				event.preventDefault();
				var oldZoom = $('input[name="zoom"]').val();
				var newZoom = Math.max(10, parseFloat(oldZoom) - 10*Math.sign(event.detail));
				offsetX += (event.offsetX - offsetX)*(1-newZoom/oldZoom);
				offsetY += (event.offsetY - offsetY)*(1-newZoom/oldZoom);
				$('input[name="zoom"]').val(newZoom);
				redrawPlot();
			}
		}
		
		
		
		/*
		 * Returned public function createBeamlinePlottingSystem.
		 */
		return function(cvs){
			canvas = cvs[0];
			
			createPlotControls(cvs); 
			registerEventHandlers();
			
			var system = {
					updatePlot : function(bl, res){
						beamline = bl;
						results = res;
						if(beamline.wavelength === undefined) {
							$('input[name="axes"], [name=calibrants]').prop('disabled', true);
							$('input[name="axes"], [name=calibrants]').prop('checked', false);
						}
						else $('input[name="axes"], [name=calibrants]').prop('disabled', false);
						redrawPlot();
					}
			};
			
			return system;
		}
	})();
	
	
	/**
	 * Draws a 1D diagram of the visible and requested ranges on the given canvas.
	 */
	module.createResultsBar = (function() {
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
		   drawLine(minRequestedX, canvas.height/4, minRequestedX, 3*canvas.height/4, "black", ctx);
		   drawLine(maxRequestedX, canvas.height/4, maxRequestedX, 3*canvas.height/4, "black", ctx);
		}
		
		
		/*
		 * Returned public function createResultsBar.
		 */
		return function(bl, res, cvs){
			beamline = bl;
			results = res;
			canvas = cvs;
			ctx = canvas.getContext("2d");
			clearPlot("white", ctx, canvas);
			drawResultsBar();
		};
	})();
	
})(plottingService);
