/**
 * This script initialises the UI with default values obtained from the server.
 * The default values can be changed by modifying the preference files stored on the server.
 */

(function() {
	var detectors;              // The list of available detectors
	var defaultDetector = {};
	var beamlines;             // The list of pre-defined beamline configuration templates.


	function getDetectorsFromPreference(callback){
		 $.ajax({
		        url: "DetectorPreferencesServlet",
		        dataType: "json",
		        success: callback
		    });
	}


	function getBeamlineTemplatesFromPreference(callback){
		$.ajax({
	       url: "BeamlineConfigurationPreferencesServlet",
	       dataType: "json",
	       success: callback
	   });
	}


	/*
	 * Get the list of available detectors from the server, wait for the response from the server, 
	 * and then get the list of beamline configurations from the server.
	 */
	getDetectorsFromPreference(function(response){
		    detectors = response.diffractionDetectors;
	        if(detectors.length == 0) console.log("The server did not return any detectors. No detectors have been loaded.");
	        else {
	        	defaultDetector = detectors[0];
	        	var select = document.getElementById('detectorsCombo');
	            for(var i in detectors){
	             	var dd = detectors[i];
	             	var opt = document.createElement('option');
	                opt.value = dd.detectorName;
	                opt.innerHTML = dd.detectorName;
	                opt.dataset.info = JSON.stringify(dd);
	                select.appendChild(opt);
	            }
	        }
	        
	        getBeamlineTemplatesFromPreference(function(response){
	        	beamlines = response.beamlineConfigurations;
	            if(beamlines.length == 0) console.log("The server did not return any beamline configuration templates. None will be used.");
	            else {
	            	var beamline = beamlines[0];
	            	var select = document.getElementById('beamlineTemplatesCombo');
	                for(var i in beamlines){
	                 	var bc = beamlines[i];
	                 	bc.detector = defaultDetector;  //TODO add the choice of detector to the BeamlineConfigurationPreferencesServlet.
	                 	var opt = document.createElement('option');
	                    opt.value = JSON.stringify(bc);
	                    opt.innerHTML = bc.name;
	                    select.appendChild(opt);
	                }
	                $('#beamlineTemplatesCombo').val(JSON.stringify(beamline)).change();
	            }
	        });
	});
})();




