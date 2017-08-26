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
	
	
	
	/*alert(convertQToD(2*Math.PI, "m^-1", "nm")); // 10^9
	alert(convertDToQ(2*Math.PI, "m", "m^-1"));  // 1
	alert(convertToQ("q", 1, "m^-1", "nm^-1"));  // 10^-9
	alert(convertToQ("s", 1, "m^-1", "m^-1"));   // 2*pi
	alert(convertToQ("d", 2*Math.PI, "m", "m^-1")); // 1
	alert(convertFromQ("q", 1, "m^-1", "nm^-1")); // 10^-9
	alert(convertFromQ("d", 2*Math.PI, "m^-1", "nm")); // 10^9
	alert(convertFromQ("s", 2*Math.PI, "m^-1", "nm^-1")); // 10^-9*/
	
})(scattering);


