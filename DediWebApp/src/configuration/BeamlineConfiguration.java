package configuration;

import configuration.devices.Beamstop;
import configuration.devices.CameraTube;
import configuration.devices.DiffractionDetector;



/**
 * This class represents the configuration of an X-ray scattering beamline. 
 * It stores all the parameters that are needed for the determination of the range of scattering vectors q 
 * that can be observed on the detector in a particular direction along the surface of the detector.
 * 
 * To get hold of the currently used BeamlineConfiguration use the {@link ResultsService} class' static getter methods.
 */
public final class BeamlineConfiguration {
	private DiffractionDetector detector;
	private Beamstop beamstop;
	private CameraTube cameraTube;
	private Double angle;                   // The angle (in rad) that specifies the direction along the surface of the detector for which the q ranges should be calculated.
	private Double cameraLength;            // Sample-detector distance in m.
	private Integer clearance; 
	private Double wavelength;
	private Double minWavelength;            // Minimum allowed wavelength of the X-ray beam in m.
	private Double maxWavelength;            // Maximum allowed wavelength of the X-ray beam in m.
	private Double minCameraLength;          // Minimum sample-detector distance in m.
	private Double maxCameraLength;          // Maximum sample-detector distance in m.
	
	
	public BeamlineConfiguration() {
		detector = null;
		beamstop = null;
		cameraTube = null;
		angle = null;
		cameraLength = null;
		clearance = null;
		wavelength = null;
		minWavelength = null;
		maxWavelength = null;
		minCameraLength = null;
		maxCameraLength = null;
	}
	
	
	// Getters and Setters
	

	public DiffractionDetector getDetector() {
		return detector;
	}

	
	/**
	 * A convenience method that provides the width of the detector in millimetres,
	 * as the {@link DiffractionDetector} class provides it in pixels only.
	 * 
	 * @return The detector width in millimetres. Returns null if the detector is null.
	 */
	public Double getDetectorWidthMM(){
		if(detector == null) return null;
		return detector.getNumberOfPixelsX()*detector.getXPixelMM();
	}
	
	
	/**
	 * A convenience method that provides the height of the detector in millimetres,
	 * as the {@link DiffractionDetector} class provides it in pixels only.
	 * 
	 * @return The detector height in millimetres. Returns null if the detector is null.
	 */
	public Double getDetectorHeightMM(){
		if(detector == null) return null;
		return detector.getNumberOfPixelsY()*detector.getYPixelMM();
	}
	
	
	public void setDetector(DiffractionDetector detector) {
		this.detector = detector;
	}

	
	/**
	 * @return - angle (in rad) that specifies the direction along the surface of the detector 
	 *           for which the q ranges should be calculated.
	 */
	public Double getAngle() {
		return angle;
	}

	
	/** 
	 * @param angle - the new angle in radians.
	 */
	public void setAngle(Double angle) {
		this.angle = angle;
	}

	
	/**
	 * @return - camera length in metres.
	 */
	public Double getCameraLength() {
		return cameraLength;
	}

	
	/** 
	 * @param cameraLength - the new camera length in metres.
	 */
	public void setCameraLength(Double cameraLength) {
		this.cameraLength = cameraLength;
	}

	
	/**
	 * @return - clearance in pixels.
	 */
	public Integer getClearance() {
		return clearance;
	}
	
	
	/** 
	 * Since clearance is specified in pixels and the pixels of the detector are allowed to have unequal height and width, 
	 * the clearance region is, in the general case, an ellipse. 
	 * This method returns the length of this ellipse's semi-major axis.
	 * 
	 * @return The length of the semi-major axis of the clearance in millimetres, 
	 *         or null if the clearance or the detector is null. 
	 */
	public Double getClearanceMajorMM() {
		if(detector == null || clearance == null) return null;
		return clearance*detector.getXPixelMM();
	}
	
	
	/**
	 * Since clearance is specified in pixels and the pixels of the detector are allowed to have unequal height and width, 
	 * the clearance region is, in the general case, an ellipse. 
	 * This method returns the length of this ellipse's semi-minor axis.
	 * 
	 * @return The length of the semi-minor axis of the clearance in millimetres,
	 *         or null if the clearance or the detector is null. 
	 */
	public Double getClearanceMinorMM() {
		if(detector == null || clearance == null) return null;
		return clearance*detector.getYPixelMM();
	}
	
    
	/**
	 * @return The length of the semi-major axis of the "clearance region" (beamstop + clearance) in millimeters,
	 *         or null if the clearance, beamstop or the detector are null. 
	 */
	public Double getClearanceAndBeamstopMajorMM(){
		if(getClearanceMajorMM() == null || beamstop == null) return null;
		return getClearanceMajorMM() + beamstop.getRadiusMM();
	}
	
	
	/**
	 * @return The length of the semi-minor axis of the "clearance region" (beamstop + clearance) in millimeters,
	 *         or null if the clearance, beamstop or the detector are null. 
	 */
	public Double getClearanceAndBeamstopMinorMM(){
		if(getClearanceMinorMM() == null || beamstop == null) return null;
		return getClearanceMinorMM() + beamstop.getRadiusMM();
	}
	
	
	/**
	 * @return The length of the semi-major axis of the "clearance region" (beamstop + clearance) in pixels,
	 *         or null if the clearance, beamstop or the detector are null. 
	 */
	public Double getClearanceAndBeamstopMajorPixels(){
		if(clearance == null || getBeamstopMajorPixels() == null) return null;
		return clearance + getBeamstopMajorPixels();
	}
	
	
	/**
	 * @return The length of the semi-minor axis of the "clearance region" (beamstop + clearance) in pixels,
	 *         or null if the clearance, beamstop or the detector are null. 
	 */
	public Double getClearanceAndBeamstopMinorPixels(){
		if(clearance == null || getBeamstopMinorPixels() == null) return null;
		return clearance + getBeamstopMinorPixels();
	}
	
	
	/** 
	 * @param clearance - the new clearance in pixels.
	 */
	public void setClearance(Integer clearance) {
		this.clearance = clearance;
	}


	/**
	 * @return - wavelength of the X-ray beam in metres.
	 */
	public Double getWavelength() {
		return wavelength;
	}

	
	/** 
	 * @param wavelength - the new wavelength in metres.
	 */
	public void setWavelength(Double wavelength) {
		this.wavelength = wavelength;
	}

	
	public Beamstop getBeamstop() {
		return beamstop;
	}

	
	/**
	 * @return The length of the semi-major axis of the beamstop in pixels,
	 *         or null if the beamstop or the detector are null. 
	 */
	public Double getBeamstopMajorPixels(){
		if(beamstop == null || detector == null) return null;
		return beamstop.getRadiusMM()/detector.getXPixelMM();
	}
	
	
	/**
	 * @return The length of the semi-minor axis of the beamstop in pixels,
	 *         or null if the beamstop or the detector are null. 
	 */
	public Double getBeamstopMinorPixels(){
		if(beamstop == null || detector == null) return null;
		return beamstop.getRadiusMM()/detector.getYPixelMM();
	}
	
	
	/**
	 * @return - the x coordinate of the centre of the beamstop w.r.t. the top left corner of the detector in millimetres,
	 *           or null if the beamstop or detector are null.
	 */  
	public Double getBeamstopXCentreMM(){
		if(beamstop == null || detector == null) return null;
		return beamstop.getXCentre()*detector.getXPixelMM();
	}
	
	
	/**
	 * @return - the y coordinate of the centre of the beamstop w.r.t. the top left corner of the detector in millimetres,
	 *           or null if the beamstop or detector are null.
	 */
	public Double getBeamstopYCentreMM(){
		if(beamstop == null || detector == null) return null;
		return beamstop.getYCentre()*detector.getYPixelMM();
	}
	
	
	public void setBeamstop(Beamstop beamstop) {
		this.beamstop = beamstop;
	}

	
	public CameraTube getCameraTube() {
		return cameraTube;
	}
	
	
	/**
	 * @return The length of the semi-major axis of the camera tube's projection onto detector in pixels,
	 *         or null if the camera tube or the detector are null. 
	 */
	public Double getCameraTubeMajorPixels(){
		if(cameraTube == null || detector == null) return null;
		return cameraTube.getRadiusMM()/detector.getXPixelMM();
	}
	
	
	/**
	 * @return The length of the semi-minor axis of the camera tube's projection onto detector in pixels,
	 *         or null if the camera tube or the detector are null. 
	 */
	public Double getCameraTubeMinorPixels(){
		if(cameraTube == null || detector == null) return null;
		return cameraTube.getRadiusMM()/detector.getYPixelMM();
	}
	
	
	/**
	 * @return - the x coordinate of the centre of the camera tube's projection onto detector
	 *           w.r.t. the top left corner of the detector in millimetres, or null if the camera tube or detector are null.
	 */
	public Double getCameraTubeXCentreMM(){
		if(cameraTube == null || detector == null) return null;
		return cameraTube.getXCentre()*detector.getXPixelMM();
	}

	
	/**
	 * @return - the y coordinate of the centre of the camera tube's projection onto detector
	 *           w.r.t. the top left corner of the detector in millimetres, or null if the camera tube or detector are null.
	 */
	public Double getCameraTubeYCentreMM(){
		if(cameraTube == null || detector == null) return null;
		return cameraTube.getYCentre()*detector.getYPixelMM();
	}
	
	
	public void setCameraTube(CameraTube cameraTube) {
		this.cameraTube = cameraTube;
	}
	
	
	/**
	 * @return - maximum achievable wavelength of the beam in metres.
	 */
	public Double getMaxWavelength() {
		return maxWavelength;
	}

	
	/** 
	 * @param wavelength - the maximum allowed wavelength in metres.
	 */
	public void setMaxWavelength(Double wavelength) {
		this.maxWavelength = wavelength;
	}
	
	
	/**
	 * @return - minimum achievable wavelength of the beam in metres.
	 */
	public Double getMinWavelength() {
		return minWavelength;
	}

	/** 
	 * @param wavelength - the minimum allowed wavelength in metres.
	 */
	public void setMinWavelength(Double wavelength) {
		this.minWavelength = wavelength;
	}
	
	
	/**
	 * @return - minimum possible camera length in metres.
	 */
	public Double getMinCameraLength() {
		return minCameraLength;
	}

	
	/** 
	 * @param cameraLength - the minimum sample-to-detector distance in metres.
	 */
	public void setMinCameraLength(Double cameraLength) {
		this.minCameraLength = cameraLength;
	}
	
	

	/**
	 * @return - maximum possible camera length in metres.
	 */
	public Double getMaxCameraLength() {
		return maxCameraLength;
	}

	
	/** 
	 * @param cameraLength - the minimum sample-to-detector distance in metres.
	 */
	public void setMaxCameraLength(Double cameraLength) {
		this.maxCameraLength = cameraLength;
	}
}

