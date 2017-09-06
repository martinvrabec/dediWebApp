/**
 * This script gets the preferences from the server.
 * The default values can be changed by modifying the preference files stored on the server.
 */
var preferenceService = {};

(function(context){
	context.loadBeamlinePreferences = function(callback) {
		var detectors = [];              // The list of available detectors
		var beamlines = [];             // The list of pre-defined beamline configuration templates.


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
		        
		        getBeamlineTemplatesFromPreference(function(response){
		        	beamlines = response.beamlineConfigurations;
		            callback({detectors : detectors, beamlines : beamlines});
		        });
		});
	};
})(preferenceService);
