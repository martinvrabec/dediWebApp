package configuration;

import configuration.devices.Beamstop;
import configuration.devices.CameraTube;
import configuration.devices.DiffractionDetector;



/**
 * To get the currently used BeamlineConfiguration use the {@link ResultsService} class.
 */
public final class BeamlineConfiguration {
	private DiffractionDetector detector;
	private Beamstop beamstop;
	private CameraTube cameraTube;
	private Double angle;
	private Double cameraLength;
	private Integer clearance; 
	private Double wavelength;
	private Double minWavelength;
	private Double maxWavelength;
	private Double minCameraLength;
	private Double maxCameraLength;
	
	
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


	public Double getAngle() {
		return angle;
	}

	
	public void setAngle(Double angle) {
		this.angle = angle;
	}

	
	public Double getCameraLength() {
		return cameraLength;
	}

	
	public void setCameraLength(Double cameraLength) {
		this.cameraLength = cameraLength;
	}

	
	public Integer getClearance() {
		return clearance;
	}
	
	
	/**
	 * Within the {@link BeamlineConfiguration}, clearance is specified in pixels, 
	 * so this method converts this to millimetres.
	 * Since the pixels of the detector are allowed to have their height different from their width,
	 * the clearance actually becomes an ellipse. 
	 * This method returns the length of this ellipse's semi-major axis.
	 * 
	 * @return The length of the semi-major axis of the clearance in millimetres. 
	 * Returns null if the clearance or the detector is null. 
	 */
	public Double getClearanceMajorMM() {
		if(detector == null || clearance == null) return null;
		return clearance*detector.getXPixelMM();
	}
	
	
	/**
	 * Within the {@link BeamlineConfiguration}, clearance is specified in pixels, 
	 * so this method converts this to millimetres.
	 * Since the pixels of the detector are allowed to have their height different from their width,
	 * the clearance actually becomes an ellipse. 
	 * This method returns the length of this ellipse's semi-minor axis.
	 * 
	 * @return The length of the semi-minor axis of the clearance in millimetres.
	 * Returns null if the clearance or the detector is null. 
	 */
	public Double getClearanceMinorMM() {
		if(detector == null || clearance == null) return null;
		return clearance*detector.getYPixelMM();
	}
	
    
	public Double getClearanceAndBeamstopMajorMM(){
		if(getClearanceMajorMM() == null || beamstop == null) return null;
		return getClearanceMajorMM() + beamstop.getRadiusMM();
	}
	
	
	public Double getClearanceAndBeamstopMinorMM(){
		if(getClearanceMinorMM() == null || beamstop == null) return null;
		return getClearanceMinorMM() + beamstop.getRadiusMM();
	}
	
	
	public Double getClearanceAndBeamstopMajorPixels(){
		if(clearance == null || getBeamstopMajorPixels() == null) return null;
		return clearance + getBeamstopMajorPixels();
	}
	
	
	public Double getClearanceAndBeamstopMinorPixels(){
		if(clearance == null || getBeamstopMinorPixels() == null) return null;
		return clearance + getBeamstopMinorPixels();
	}
	
	
	public void setClearance(Integer clearance) {
		this.clearance = clearance;
	}

	
	public Double getWavelength() {
		return wavelength;
	}

	
	public void setWavelength(Double wavelength) {
		this.wavelength = wavelength;
	}

	
	public Beamstop getBeamstop() {
		return beamstop;
	}

	
	public Double getBeamstopMajorPixels(){
		if(beamstop == null || detector == null) return null;
		return beamstop.getRadiusMM()/detector.getXPixelMM();
	}
	
	
	public Double getBeamstopMinorPixels(){
		if(beamstop == null || detector == null) return null;
		return beamstop.getRadiusMM()/detector.getYPixelMM();
	}
	
	
	public Double getBeamstopXCentreMM(){
		if(beamstop == null || detector == null) return null;
		return beamstop.getXCentre()*detector.getXPixelMM();
	}
	
	
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
	
	
	public Double getCameraTubeMajorPixels(){
		if(cameraTube == null || detector == null) return null;
		return cameraTube.getRadiusMM()/detector.getXPixelMM();
	}
	
	
	public Double getCameraTubeMinorPixels(){
		if(cameraTube == null || detector == null) return null;
		return cameraTube.getRadiusMM()/detector.getYPixelMM();
	}
	
	
	public Double getCameraTubeXCentreMM(){
		if(cameraTube == null || detector == null) return null;
		return cameraTube.getXCentre()*detector.getXPixelMM();
	}

	
	public Double getCameraTubeYCentreMM(){
		if(cameraTube == null || detector == null) return null;
		return cameraTube.getYCentre()*detector.getYPixelMM();
	}
	
	
	public void setCameraTube(CameraTube cameraTube) {
		this.cameraTube = cameraTube;
	}
	
	
	public Double getMaxWavelength() {
		return maxWavelength;
	}

	
	public void setMaxWavelength(Double wavelength) {
		this.maxWavelength = wavelength;
	}
	
	
	public Double getMinWavelength() {
		return minWavelength;
	}

	
	public void setMinWavelength(Double wavelength) {
		this.minWavelength = wavelength;
	}
	
	
	public Double getMinCameraLength() {
		return minCameraLength;
	}

	
	public void setMinCameraLength(Double cameraLength) {
		this.minCameraLength = cameraLength;
	}
	
	
	public Double getMaxCameraLength() {
		return maxCameraLength;
	}

	
	public void setMaxCameraLength(Double cameraLength) {
		this.maxCameraLength = cameraLength;
	}
}

