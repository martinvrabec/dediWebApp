package servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.measure.unit.SI;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.vecmath.Vector2d;
import javax.vecmath.Vector3d;

import org.jscience.physics.amount.Amount;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import configuration.BeamlineConfiguration;
import configuration.calculations.NumericRange;
import configuration.calculations.QSpace;
import configuration.calculations.geometry.Ray;
import configuration.devices.Beamstop;
import configuration.devices.CameraTube;
import configuration.devices.DetectorProperties;
import configuration.devices.DiffractionCrystalEnvironment;
import configuration.devices.DiffractionDetector;
import configuration.results.Results;

/**
 * Servlet implementation class BeamlineConfigurationServlet
 */
@WebServlet("/BeamlineConfigurationResultsServlet")
public class BeamlineConfigurationResultsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    @Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	PrintWriter writer =  response.getWriter();
		
		JSONObject obj = new JSONObject(request.getParameter("configuration"));
		Gson gson = new GsonBuilder().create();
		
		BeamlineConfiguration bc = new BeamlineConfiguration();
		
		try {
			// Get the beamline configuration
			DiffractionDetector detector = gson.fromJson(obj.getJSONObject("detector").toString(), DiffractionDetector.class);
			detector.setxPixelSize(Amount.valueOf(obj.getJSONObject("detector").getDouble("XPixelMM"), SI.MILLIMETRE));
			detector.setyPixelSize(Amount.valueOf(obj.getJSONObject("detector").getDouble("YPixelMM"), SI.MILLIMETRE));
			bc.setDetector(detector);
			bc.setBeamstop(new Beamstop(Amount.valueOf(obj.getDouble("beamstopDiameter"), SI.MILLIMETER), 
					                    obj.getDouble("beamstopXCentre"), 
					                    obj.getDouble("beamstopYCentre")));
			bc.setClearance((int) obj.getDouble("clearance"));
			
			double cameraTubeDiameter = obj.getDouble("cameraTubeDiameter");
			if(cameraTubeDiameter == 0)
				bc.setCameraTube(null);
			else
				bc.setCameraTube(new CameraTube(Amount.valueOf(obj.getDouble("cameraTubeDiameter"), SI.MILLIMETER), 
					                            obj.getDouble("cameraTubeXCentre"), 
					                            obj.getDouble("cameraTubeYCentre")));
			
			bc.setAngle(obj.getDouble("angle"));
		} catch (JSONException e) {
			writer.print("");
			writer.close();
			return;
		}
		
		try {
			bc.setCameraLength(obj.getDouble("cameraLength"));
			bc.setMinCameraLength(obj.getDouble("minCameraLength"));
			bc.setMaxCameraLength(obj.getDouble("maxCameraLength"));
		} catch (JSONException e) {
			bc.setCameraLength(null);
		}
		
		try {
			bc.setWavelength(obj.getDouble("wavelength"));
			bc.setMinWavelength(obj.getDouble("minWavelength"));
			bc.setMaxWavelength(obj.getDouble("maxWavelength"));
		} catch (JSONException e) {
			bc.setWavelength(null);
		}
		Double requestedMin;
		Double requestedMax;
		try {
			requestedMin = obj.getDouble("requestedMin");
			requestedMax = obj.getDouble("requestedMax");
		} catch (JSONException e) {
			requestedMin = null;
			requestedMax = null;
		}
		
		Results results = computeQRanges(bc, requestedMin, requestedMax);
		
		
		JSONObject res = new JSONObject(results);
		writer.print(res);
		
		writer.close();
	}

	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
    @Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
    
    private Results computeQRanges(BeamlineConfiguration bc, Double requestedMin, Double requestedMax) {
       	DiffractionDetector detector = bc.getDetector();
    	Double detectorWidthMM = bc.getDetectorWidthMM();
    	Double detectorHeightMM = bc.getDetectorHeightMM();
		Double beamstopXCentreMM = bc.getBeamstopXCentreMM();
		Double beamstopYCentreMM = bc.getBeamstopYCentreMM();
		CameraTube cameraTube = bc.getCameraTube(); 
		Double cameraTubeXCentreMM = bc.getCameraTubeXCentreMM();
		Double cameraTubeYCentreMM = bc.getCameraTubeYCentreMM();
		Double angle = bc.getAngle();
		Double clearanceRegionMajorMM = bc.getClearanceAndBeamstopMajorMM();
		Double clearanceRegionMinorMM = bc.getClearanceAndBeamstopMinorMM();
		Double wavelength = bc.getWavelength();
		Double minWavelength = bc.getMinWavelength();
		Double maxWavelength = bc.getMaxWavelength();
		Double cameraLength = bc.getCameraLength();
		Double minCameraLength = bc.getMinCameraLength();
		Double maxCameraLength = bc.getMaxCameraLength();
    	
		
		Results results = new Results();
		
    	
		// Find the intersection pt of the clearance region (beamstop + clearance) with a line at the given angle starting at the beamstop centre.
		Vector2d initialPosition = new Vector2d(clearanceRegionMajorMM*Math.cos(angle) + beamstopXCentreMM, 
				                                clearanceRegionMinorMM*Math.sin(angle) + beamstopYCentreMM);
		
		
		// Find the portion of a ray from the initial position at the given angle that lies within the detector face.
		Ray ray = new Ray(new Vector2d(Math.cos(angle), Math.sin(angle)), initialPosition);
		NumericRange t1 = ray.getRectangleIntersectionParameterRange(new Vector2d(0, detectorHeightMM), 
				                									 detectorWidthMM, detectorHeightMM);
		
		
		// Find the portion of the ray that lies within the camera tube's projection onto the detector face.
		if(t1 != null && cameraTube != null && cameraTube.getRadiusMM() != 0)
			t1 = t1.intersect(ray.getCircleIntersectionParameterRange(cameraTube.getRadiusMM(), 
	                                       new Vector2d(cameraTubeXCentreMM, cameraTubeYCentreMM)));
		
		
		// Check whether the intersection is empty.
		if(t1 == null){
			results.setVisibleRange(null, null, null);
			results.setFullRange(null);
			return results;
		}
		
		
		// Find the points that correspond to the end points of the range.
		Vector2d ptMin = ray.getPt(t1.getMin());
		Vector2d ptMax = ray.getPt(t1.getMax());
		
		
		// If the wavelength or camera length are not known then can't actually calculate the visible Q values from the above distances,
		// so just set the end points of the Q ranges.
		if(wavelength == null || cameraLength == null){
			results.setVisibleRange(null, new Vector2d(ptMin), new Vector2d(ptMax));
			results.setFullRange(null);
			return results;
		}
		
		
		if(requestedMin != null && requestedMax != null) {
			results.setRequestedRange(new NumericRange(requestedMin, requestedMax), getPtForQ(requestedMin, angle, beamstopXCentreMM, beamstopYCentreMM, cameraLength, wavelength),
									  getPtForQ(requestedMax, angle, beamstopXCentreMM, beamstopYCentreMM, cameraLength, wavelength));
		}
		
		
		// Calculate the visible Q range.
		DetectorProperties detectorProperties = 
				new DetectorProperties(cameraLength*1e3, beamstopXCentreMM, beamstopYCentreMM, 
									   detector.getNumberOfPixelsY(), detector.getNumberOfPixelsX(), 
									   detector.getYPixelMM(), detector.getXPixelMM()); // Convert lengths to mm.
		QSpace qSpace = new QSpace(detectorProperties, new DiffractionCrystalEnvironment(wavelength*1e10)); // Need to convert wavelength to Angstroms.
		
		Vector3d visibleQMin = qSpace.qFromPixelPosition(ptMin.x/detector.getXPixelMM(), ptMin.y/detector.getYPixelMM());
		Vector3d visibleQMax = qSpace.qFromPixelPosition(ptMax.x/detector.getXPixelMM(), ptMax.y/detector.getYPixelMM());
		
		
		
		Vector2d ptMinCopy = new Vector2d(ptMin);
		Vector2d ptMaxCopy = new Vector2d(ptMax);
		results.setVisibleRange(new NumericRange(visibleQMin.length()*1e10, visibleQMax.length()*1e10), ptMinCopy, ptMaxCopy);
		
		
		// If min/max camera length or wavelength are not known then can't calculate the full range.
		if(maxCameraLength == null || minCameraLength == null || maxWavelength == null || minWavelength == null){
			results.setFullRange(null);
		}
		
		// Compute the full range.
		detectorProperties.getOrigin().z = minCameraLength*1e3;
		qSpace.setDiffractionCrystalEnvironment(new DiffractionCrystalEnvironment(minWavelength*1e10));
		Vector3d fullQMin = qSpace.qFromPixelPosition(ptMax.x/detector.getXPixelMM(), ptMax.y/detector.getYPixelMM());
		
		detectorProperties.getOrigin().z = maxCameraLength*1e3;
		qSpace.setDiffractionCrystalEnvironment(new DiffractionCrystalEnvironment(maxWavelength*1e10));
		Vector3d fullQMax = qSpace.qFromPixelPosition(ptMin.x/detector.getXPixelMM(), ptMin.y/detector.getYPixelMM());
		
		// Set the full range.
		results.setFullRange(new NumericRange(fullQMin.length()*1e10, fullQMax.length()*1e10));
		
		return results;
    }
    
	
	private Vector2d getPtForQ(double qvalue, double angle, double beamstopXCentreMM, 
			                   double beamstopYCentreMM, double cameraLength, double wavelength){
		Ray ray = new Ray(new Vector2d(Math.cos(angle), Math.sin(angle)), 
				          new Vector2d(beamstopXCentreMM, beamstopYCentreMM));
		
		return ray.getPtAtDistance(1.0e3*calculateDistanceFromQValue(qvalue, cameraLength, wavelength));
	}
	
	
	private double calculateDistanceFromQValue(double qValue, double cameraLength, double wavelength){
		double temp = wavelength*qValue/(4*Math.PI);
		if(Math.abs(temp) > 1) throw new IllegalArgumentException();
		return Math.tan(2*Math.asin(temp))*cameraLength;
	}
}
