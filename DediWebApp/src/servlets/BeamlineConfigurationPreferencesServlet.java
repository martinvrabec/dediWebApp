package servlets;

import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.measure.unit.SI;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jscience.physics.amount.Amount;
import org.json.JSONObject;

import configuration.BeamlineConfigurationBean;
import configuration.BeamlineConfigurationBeanList;
import configuration.devices.DiffractionDetector;


/**
 * Servlet implementation class BeamlineConfigurationPreferencesServlet
 */
@WebServlet("/BeamlineConfigurationPreferencesServlet")
public class BeamlineConfigurationPreferencesServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
   

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    @Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");  
		
		List<BeamlineConfigurationBean> configurations = getConfigurations();
		
		BeamlineConfigurationBeanList dds = new BeamlineConfigurationBeanList();
		dds.setBeamlineConfigurations(configurations);
		
		try {
			PrintWriter out = response.getWriter();
			JSONObject obj = new JSONObject(dds);
			out.print(obj);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
    @Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	
	@SuppressWarnings("unchecked")
	private List<BeamlineConfigurationBean> getConfigurations(){
		List<BeamlineConfigurationBean> configurations = new ArrayList<>(); 
		
		FileReader fileReader = null;
        BufferedReader bufferedReader = null;
        PrintWriter writer = null;
        try {
            File f = new File("beamlinePreferences.txt");
            if (!f.exists()) {
            	configurations = getDefaultBeamlines();
                f.createNewFile();
                writer = new PrintWriter(new FileWriter(f));
        		ByteArrayOutputStream baos = new ByteArrayOutputStream();
        		XMLEncoder xmlEncoder = new XMLEncoder(baos);
        		xmlEncoder.writeObject(configurations);
        		xmlEncoder.close();
        		writer.println(baos.toString());
        		writer.close();
            }
            else {
            	fileReader = new FileReader(f);
                bufferedReader = new BufferedReader(fileReader);
                
                StringBuffer sb = new StringBuffer();
                int i;
                while ((i = bufferedReader.read())!=-1) {
                    sb.append((char) i);
                }
                
                try{
                	String xml = sb.toString();
                    XMLDecoder xmlDecoder = new XMLDecoder(new ByteArrayInputStream(xml.getBytes()));
            		configurations = (List<BeamlineConfigurationBean>) xmlDecoder.readObject();
            		xmlDecoder.close();
                } catch(Exception e){
                	e.printStackTrace();
                	configurations = getDefaultBeamlines();
                }
            }
        } catch (Exception ex) {
            if (writer != null) {
                writer.close();
            }
        }
        if (bufferedReader != null) {
            try {
                bufferedReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        return configurations;
	}


	private List<BeamlineConfigurationBean> getDefaultBeamlines() {
		List<BeamlineConfigurationBean> configurations = new ArrayList<>(); 
		
		BeamlineConfigurationBean bc1 = new BeamlineConfigurationBean();
		bc1.setName("I22 SAXS Config 1");
		bc1.setBeamstopDiameter(4);
		bc1.setBeamstopXCentre(737.5);
		bc1.setBeamstopYCentre(0);
		bc1.setCameraTubeDiameter(350);
		bc1.setCameraTubeXCentre(737.5);
		bc1.setCameraTubeYCentre(839.5);
		bc1.setClearance(10);
		bc1.setMinWavelength(0.1);
		bc1.setMaxWavelength(0.5);
		bc1.setMinCameraLength(1.9);
		bc1.setMaxCameraLength(9.9);
		bc1.setCameraLengthStepSize(0.25);
		
		
		BeamlineConfigurationBean bc2 = new BeamlineConfigurationBean();
		bc2.setName("I22 SAXS Config 2");
		bc2.setBeamstopDiameter(4);
		bc2.setBeamstopXCentre(737.5);
		bc2.setBeamstopYCentre(839.5);
		bc2.setCameraTubeDiameter(350);
		bc2.setCameraTubeXCentre(737.5);
		bc2.setCameraTubeYCentre(839.5);
		bc2.setClearance(10);
		bc2.setMinWavelength(0.1);
		bc2.setMaxWavelength(0.5);
		bc2.setMinCameraLength(1.9);
		bc2.setMaxCameraLength(9.9);
		bc2.setCameraLengthStepSize(0.25);
		
		
		BeamlineConfigurationBean bc3 = new BeamlineConfigurationBean();
		bc3.setName("I22 WAXS");
		bc3.setBeamstopDiameter(4);
		bc3.setBeamstopXCentre(737.5);
		bc3.setBeamstopYCentre(839.5);
		bc3.setCameraTubeDiameter(0);
		bc3.setCameraTubeXCentre(0);
		bc3.setCameraTubeYCentre(0);
		bc3.setClearance(10);
		bc3.setMinWavelength(0.1);
		bc3.setMaxWavelength(0.5);
		bc3.setMinCameraLength(0.18);
		bc3.setMaxCameraLength(0.58);
		bc3.setCameraLengthStepSize(0.01);
		
		
		// Pilatus 2M - the default detector for SAXS at I22
		DiffractionDetector pilatus2M = new DiffractionDetector();
		pilatus2M.setDetectorName("Pilatus P3-2M");
		pilatus2M.setxPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		pilatus2M.setyPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		pilatus2M.setNumberOfPixelsX(1475);
		pilatus2M.setNumberOfPixelsY(1679);
		pilatus2M.setNumberOfHorizontalModules(3);
		pilatus2M.setNumberOfVerticalModules(8);
		pilatus2M.setXGap(7);
		pilatus2M.setYGap(17);
		
		List<DiffractionDetector> saxsDetectors = new ArrayList<>();
		saxsDetectors.add(pilatus2M);
		bc1.setDetectors(saxsDetectors);
		bc2.setDetectors(saxsDetectors);
		
		
		// Pilatus 2M for WAXS - the default detector for WAXS
		DiffractionDetector pilatus2MDLSL = new DiffractionDetector();
		pilatus2MDLSL.setDetectorName("Pilatus P3-2M-DLS-L (for WAXS)");
		pilatus2MDLSL.setxPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		pilatus2MDLSL.setyPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		pilatus2MDLSL.setNumberOfPixelsX(1475);
		pilatus2MDLSL.setNumberOfPixelsY(1679);
		pilatus2MDLSL.setNumberOfHorizontalModules(3);
		pilatus2MDLSL.setNumberOfVerticalModules(8);
		pilatus2MDLSL.setXGap(7);
		pilatus2MDLSL.setYGap(17);
		List<Integer> missingModules = new ArrayList<>();
		missingModules.addAll(Arrays.asList(17, 20, 23));
		pilatus2MDLSL.setMissingModules(missingModules);
		
		List<DiffractionDetector> waxsDetectors = new ArrayList<>();
		waxsDetectors.add(pilatus2MDLSL);
		bc3.setDetectors(waxsDetectors);
		
		
		configurations.add(bc1);
		configurations.add(bc2);
		configurations.add(bc3);
		
		return configurations;
	}
}
