/**
 * This script gets the preferences from the server.
 * The default values can be changed by modifying the preference files stored on the server.
 */
var preferenceService = {};

(function(context){
	context.loadBeamlinePreferences = function(callback) {
		$.ajax({
	       url: "BeamlineConfigurationPreferencesServlet",
	       dataType: "json",
	       success: function(response){
	            callback(response.beamlineConfigurations);
	        }
	   });
	};
})(preferenceService);
