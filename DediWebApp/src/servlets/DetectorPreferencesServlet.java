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

import configuration.devices.DiffractionDetector;
import configuration.devices.DiffractionDetectorList;

/**
 * Servlet implementation class DetectorPreferencesServlet
 */
@WebServlet("/DetectorPreferencesServlet")
public class DetectorPreferencesServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    @Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");  
		
		List<DiffractionDetector> detectors = getDetectors();
        
		DiffractionDetectorList dds = new DiffractionDetectorList();
		dds.setDiffractionDetectors(detectors);
		
		try {
			PrintWriter out = response.getWriter();
			JSONObject obj = new JSONObject(dds);
			out.print(obj);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * If a detectorPreferences.txt file does not exist, it uses the default detectors and tries create 
	 * that file and populate it with an XML representation of the default detectors. 
	 * If it exists, it tries to parse the XML to get the list of detectors.
	 * If it fails to parse the XML, it uses the default detectors (however it does not overwrite the 
	 * broken file).
	 */
	@SuppressWarnings("unchecked")
	private List<DiffractionDetector> getDetectors(){
		List<DiffractionDetector> detectors = new ArrayList<>();
		
		FileReader fileReader = null;
        BufferedReader bufferedReader = null;
        PrintWriter writer = null;
        try {
            File f = new File("detectorPreferences.txt");
            if (!f.exists()) {
            	detectors = getDefaultDetectors();
                f.createNewFile();
                writer = new PrintWriter(new FileWriter(f));
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
        		XMLEncoder xmlEncoder = new XMLEncoder(baos);
        		xmlEncoder.writeObject(detectors);
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
            		detectors = (List<DiffractionDetector>) xmlDecoder.readObject();
            		xmlDecoder.close();
                } catch(Exception e){
                	e.printStackTrace();
                	detectors = getDefaultDetectors();
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
        
		return detectors;
	}
	
	private List<DiffractionDetector> getDefaultDetectors(){
		List<DiffractionDetector> detectors = new ArrayList<>();
		
		// Pilatus 2M
		DiffractionDetector dd0 = new DiffractionDetector();
		dd0.setDetectorName("Pilatus P3-2M");
		dd0.setxPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd0.setyPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd0.setNumberOfPixelsX(1475);
		dd0.setNumberOfPixelsY(1679);
		dd0.setNumberOfHorizontalModules(3);
		dd0.setNumberOfVerticalModules(8);
		dd0.setXGap(7);
		dd0.setYGap(17);
		dd0.setMissingModules(new ArrayList<>());
		detectors.add(dd0);

		
		// Pilatus 2M for WAXS - Pilatus 2M with 3 modules missing
		DiffractionDetector dd1 = new DiffractionDetector();
		dd1.setDetectorName("Pilatus P3-2M-DLS-L (for WAXS)");
		dd1.setxPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd1.setyPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd1.setNumberOfPixelsX(1475);
		dd1.setNumberOfPixelsY(1679);
		dd1.setNumberOfHorizontalModules(3);
		dd1.setNumberOfVerticalModules(8);
		dd1.setXGap(7);
		dd1.setYGap(17);
		List<Integer> missingModules = new ArrayList<>();
		missingModules.addAll(Arrays.asList(17, 20, 23));
		dd1.setMissingModules(missingModules);
		detectors.add(dd1);
		
		// Pilatus 6M
		DiffractionDetector dd2 = new DiffractionDetector();
		dd2.setDetectorName("Pilatus6m");
		dd2.setxPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd2.setyPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd2.setNumberOfPixelsX(2527);
		dd2.setNumberOfPixelsY(2463);
		dd2.setNumberOfHorizontalModules(12);
		dd2.setNumberOfVerticalModules(5);
		dd2.setXGap(17);
		dd2.setYGap(7);
		detectors.add(dd2);
		
		// Pilatus 100k
		DiffractionDetector dd3 = new DiffractionDetector();
		dd3.setDetectorName("Pilatus100k");
		dd3.setxPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd3.setyPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd3.setNumberOfPixelsX(195);
		dd3.setNumberOfPixelsY(487);
		dd3.setNumberOfHorizontalModules(1);
		dd3.setNumberOfVerticalModules(1);
		dd3.setXGap(0);
		dd3.setYGap(0);
		detectors.add(dd3);

		// Pilatus 300k
		DiffractionDetector dd4 = new DiffractionDetector();
		dd4.setDetectorName("Pilatus300k");
		dd4.setxPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd4.setyPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd4.setNumberOfPixelsX(619);
		dd4.setNumberOfPixelsY(487);
		dd4.setNumberOfHorizontalModules(3);
		dd4.setNumberOfVerticalModules(1);
		dd4.setXGap(17);
		dd4.setYGap(0);
		detectors.add(dd4);
		
		// Pilatus 300k-W
		DiffractionDetector dd4w = new DiffractionDetector();
		dd4w.setDetectorName("Pilatus300k-W");
		dd4w.setxPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd4w.setyPixelSize(Amount.valueOf(0.172, SI.MILLIMETRE));
		dd4w.setNumberOfPixelsX(195);
		dd4w.setNumberOfPixelsY(1475); // 3*487 + (3-1)*17
		dd4w.setNumberOfHorizontalModules(1);
		dd4w.setNumberOfVerticalModules(3);
		dd4w.setXGap(0);
		dd4w.setYGap(7);
		detectors.add(dd4w);
		
		// Pixium RF4343
		DiffractionDetector dd5 = new DiffractionDetector();
		dd5.setDetectorName("Pixium RF4343");
		dd5.setxPixelSize(Amount.valueOf(0.148, SI.MILLIMETRE));
		dd5.setyPixelSize(Amount.valueOf(0.148, SI.MILLIMETRE));
		dd5.setNumberOfPixelsX(2880);
		dd5.setNumberOfPixelsY(2881);
		detectors.add(dd5);
		
		// Perkin Elmer 1621 EN
		DiffractionDetector dd6 = new DiffractionDetector();
		dd6.setDetectorName("Perkin Elmer 1621 EN");
		dd6.setxPixelSize(Amount.valueOf(0.2, SI.MILLIMETRE));
		dd6.setyPixelSize(Amount.valueOf(0.2, SI.MILLIMETRE));
		dd6.setNumberOfPixelsX(2048);
		dd6.setNumberOfPixelsY(2048);
		detectors.add(dd6);
		
		// ADSC Q315r 
		DiffractionDetector dd7 = new DiffractionDetector();
		dd7.setDetectorName("ADSC Q315r");
		dd7.setxPixelSize(Amount.valueOf(0.1026, SI.MILLIMETRE));
		dd7.setyPixelSize(Amount.valueOf(0.1026, SI.MILLIMETRE));
		dd7.setNumberOfPixelsX(3072);
		dd7.setNumberOfPixelsY(3072);
		detectors.add(dd7);
		
		// MAR 345 image plate
		DiffractionDetector dd8 = new DiffractionDetector();
		dd8.setDetectorName("MAR 345 image plate");
		dd8.setxPixelSize(Amount.valueOf(0.1000, SI.MILLIMETRE));
		dd8.setyPixelSize(Amount.valueOf(0.1000, SI.MILLIMETRE));
		dd8.setNumberOfPixelsX(3450);
		dd8.setNumberOfPixelsY(3450);
		detectors.add(dd8);
		
		// Photonic Science X-ray FDI-VHR 125mm
		DiffractionDetector dd9 = new DiffractionDetector();
		dd9.setDetectorName("Photonic Science X-ray FDI-VHR 125mm");
		dd9.setxPixelSize(Amount.valueOf(26.0, SI.MICRO(SI.METRE)));
		dd9.setyPixelSize(Amount.valueOf(26.0, SI.MICRO(SI.METRE)));
		dd9.setNumberOfPixelsX(4008);
		dd9.setNumberOfPixelsY(2663);
		detectors.add(dd9);
		
		DiffractionDetector dd10 = new DiffractionDetector();
		dd10.setDetectorName("PLS CMOS");
		dd10.setxPixelSize(Amount.valueOf(25.3, SI.MICRO(SI.METRE)));
		dd10.setyPixelSize(Amount.valueOf(25.3, SI.MICRO(SI.METRE)));
		dd10.setNumberOfPixelsX(4098);
		dd10.setNumberOfPixelsY(2045);
		detectors.add(dd10);
		
		DiffractionDetector dd11 = new DiffractionDetector();
		dd11.setDetectorName("imXPAD-S70");
		dd11.setxPixelSize(Amount.valueOf(130, SI.MICRO(SI.METRE)));
		dd11.setyPixelSize(Amount.valueOf(130, SI.MICRO(SI.METRE)));
		dd11.setNumberOfPixelsX(1114);
		dd11.setNumberOfPixelsY(1164);
		detectors.add(dd11);
		
		DiffractionDetector dd12 = new DiffractionDetector();
		dd12.setDetectorName("Rayonix LX255-HS");
		dd12.setxPixelSize(Amount.valueOf(40, SI.MICRO(SI.METRE)));
		dd12.setyPixelSize(Amount.valueOf(40, SI.MICRO(SI.METRE)));
		dd12.setNumberOfPixelsX(1920);
		dd12.setNumberOfPixelsY(5760);
		detectors.add(dd12);
		
		DiffractionDetector dd14 = new DiffractionDetector();
		dd14.setDetectorName("Perkin Elmer 1611");
		dd14.setxPixelSize(Amount.valueOf(100, SI.MICRO(SI.METRE)));
		dd14.setyPixelSize(Amount.valueOf(100, SI.MICRO(SI.METRE)));
		dd14.setNumberOfPixelsX(4096);
		dd14.setNumberOfPixelsY(4096);
		detectors.add(dd14);
		
		DiffractionDetector dd13 = new DiffractionDetector();
		dd13.setDetectorName("ADSC 210r CCD");
		dd13.setxPixelSize(Amount.valueOf(51, SI.MICRO(SI.METRE)));
		dd13.setyPixelSize(Amount.valueOf(51, SI.MICRO(SI.METRE)));
		dd13.setNumberOfPixelsX(4096);
		dd13.setNumberOfPixelsY(4096);
		detectors.add(dd13);

		return detectors;
	}
}
