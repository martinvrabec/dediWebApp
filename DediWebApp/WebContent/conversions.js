/**
 * Library with utility functions for converting between different physical quantities and different units.
 * Access the functions via the Conversions namespace object.
 */

var Conversions = {};

(function(context){
	/*
	 * Physical constants
	 */
	
	var c = 299792458;      // speed of light
	var h = 6.6260693e-34   // Planck's constant
	var e = 1.60217653e-19  // elementary charge
	
	
	context.convertToMillimetres = function(value, unit){
		switch(unit){
			case "m":
				return value*1e3;
			case "mm":
				return value;
			case "micron":
				return value*1e-3;
			case "nm":
				return value*1e-6;
			case "angstrom":
				return value*1e-7;
			default:
				console.log("Unrecognised unit: " + unit);
				return 0;
		}
	};
	
	context.convertFromMillimetres = function(valueInMM, newUnit){
		switch(newUnit){
			case "m":
				return value*1e-3;
			case "mm":
				return valueInMM;
			case "micron":
				return valueInMM*1e3;
			case "nm":
				return value*1e6;
			case "angstrom":
				return value*1e7;
			default:
				console.log("Unrecognised unit: " + newUnit);
				return 0;
	    }
	};
	
	context.convertToRadians = function(value, unit){
		switch(unit){
			case "rad":
				return value;
			case "deg":
				return value*Math.PI/180;
			default:
				console.log("Unrecognised unit: " + unit);
				return 0;
	     }
	};
	
	context.convertFromRadians = function(valueInRadian, newUnit){
		switch(newUnit){
			case "rad":
				return valueInRadian;
			case "deg":
				return valueInRadian*180/Math.PI;
			default:
				console.log("Unrecognised unit: " + newUnit);
				return 0;
		}
	};
	
	context.convertTokeV = function(value, unit){
		switch(unit){
			case "keV":
				return value;
			case "eV":
				return value*1e-3;
			default:
				console.log("Unrecognised unit: " + unit);
				return 0;
	     }
	};
	
	context.convertFromkeV = function(valueInkeV, newUnit){
		switch(newUnit){
			case "keV":
				return valueInkeV;
			case "eV":
				return valueInkeV*1e3;
			default:
				console.log("Unrecognised unit: " + newUnit);
				return 0;
	     }
	};
	
	context.convertEnergyToWavelength = function(energy, energyUnit, wavelengthUnit){
		var energyInkeV = context.convertTokeV(energy, energyUnit);
		var wavelengthInMillimeters = h*c/(energyInkeV*e);
		return context.convertFromMillimetres(wavelengthInMillimeters, wavelengthUnit);
	};
})(Conversions);


