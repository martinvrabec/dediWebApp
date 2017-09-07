/**
 * Library with utility functions for converting between different physical quantities and different units.
 * Access the functions via the Conversions namespace object.
 */

var scattering = {};

(function(context){
	
	var qUnits = [{unit : "nm^-1" , label : "1/nm"}, {unit : "angstrom^-1", label : "1/\u212b"}];
	var dUnits = [{unit : "nm", label : "nm"}, {unit : "angstrom", label : "\u212b"}];
	var sUnits = [{unit : "nm^-1" , label : "1/nm"}, {unit : "angstrom^-1", label : "1/\u212b"}];
	
	context.getScatteringQuantities = function(){
		return ["q", "d", "s"];
	}
	
	context.getUnitsFor = function(scatteringQuantity){
		switch(scatteringQuantity){
			case "d":
				return dUnits;
			case "q":
				return qUnits;
			case "s":
				return sUnits;
			default:
				console.log("Unrecognised scattering quantity");
		}
	}
	
	
	context.convertEnergyToWavelength = function(energy, energyUnit, wavelengthUnit){
		return math.divide(math.multiply(math.planckConstant, math.speedOfLight), math.unit(energy, energyUnit).to("J")).toNumber(wavelengthUnit);
	};
	
	
	context.convertWavelengthToEnergy = function(wavelength, wavelengthUnit, energyUnit){
		return math.divide(math.multiply(math.planckConstant, math.speedOfLight), math.unit(wavelength, wavelengthUnit).to("m")).toNumber(energyUnit);
	};
	
	
	
	function convertToQ(quantity, quantityValue, quantityUnit, qUnit){
		switch(quantity){
			case "d":
				return convertDToQ(quantityValue, quantityUnit, qUnit);
			case "q":
				return math.unit(quantityValue, quantityUnit).toNumber(qUnit);
			case "s":
				return 2*Math.PI*math.unit(quantityValue, quantityUnit).toNumber(qUnit);
			default:
				console.log("Unrecognised scattering quantity");
		}
	};
	
	
	function convertFromQ(quantity, qValue, qUnit, quantityUnit){
		switch(quantity){
			case "d":
				return convertQToD(qValue, qUnit, quantityUnit);
			case "q":
				return math.unit(qValue, qUnit).toNumber(quantityUnit);
			case "s":
				return math.unit(qValue, qUnit).toNumber(quantityUnit)/(2*Math.PI);
			default:
				console.log("Unrecognised scattering quantity");
		}
	}
	
	
	function convertDToQ(d, dUnit, qUnit){
		return math.divide(2*Math.PI, math.unit(d, dUnit)).toNumber(qUnit);
	}
	
	
	function convertQToD(q, qUnit, dUnit){
		return math.divide(2*Math.PI, math.unit(q, qUnit)).toNumber(dUnit);
	}
	
	
	context.convertBetweenScatteringQuantities = 
		function(oldQuantity, oldQuantityValue, oldQuantityUnit, newQuantity, newQuantityUnit){
			return convertFromQ(newQuantity, convertToQ(oldQuantity, oldQuantityValue, oldQuantityUnit, "m^-1"), "m^-1", newQuantityUnit);
	};
	
	
	/**
	 * <p> Calculates the distance between the point at which the incident beam hits the detector and the circle of points 
	 * for which q equals the given q value.
	 * Assumes that the detector's normal vector is parallel to the beam direction.
	 * </p>
	 * <p> Note: wavelength and qValue should have their units such that their product is unity 
	 * (e.g. m and 1/m, or mm and 1/mm, but not, say, m and 1/mm).
	 * The returned value will be in the same units as the given camera length.
	 * </p>
	 * 
	 * @param qValue       - magnitude q of the scattering vector.
	 * @param cameraLength - distance between the detector and the sample.
	 * @param wavelength   - wavelength of the X-ray beam.
	 */
	context.calculateDistanceFromQValue = function(qValue, cameraLength, wavelength){
		return Math.tan(2*Math.asin(wavelength*qValue/(4*Math.PI)))*cameraLength;
	}
	
})(scattering);


