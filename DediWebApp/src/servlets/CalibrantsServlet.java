package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.measure.quantity.Length;
import javax.measure.unit.NonSI;
import javax.measure.unit.SI;
import javax.measure.unit.Unit;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jscience.physics.amount.Amount;
import org.json.JSONObject;

import configuration.calibrants.CalibrantSpacing;
import configuration.calibrants.HKL;

/**
 * Servlet implementation class CalibrantsServlet
 */
@WebServlet("/CalibrantsServlet")
public class CalibrantsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Map<String, CalibrantSpacing> calibrants = createDefaultCalibrants();
		
		try {
			PrintWriter out = response.getWriter();
			JSONObject obj = new JSONObject(calibrants);
			out.print(obj);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	
	private Map<String, CalibrantSpacing> createDefaultCalibrants() {
		Map<String, CalibrantSpacing> calibrants = new LinkedHashMap<>();
		
		Unit<Length> nm = SI.NANO(SI.METER);
		Unit<Length> angstrom = NonSI.ANGSTROM;
		
		CalibrantSpacing calibrant = new CalibrantSpacing("Collagen Wet"); 
		calibrant.addHKL(new HKL(0, 0, 1,  Amount.valueOf(67.0, nm)));
		calibrant.addHKL(new HKL(0, 0, 2,  Amount.valueOf(33.5, nm)));
		calibrant.addHKL(new HKL(0, 0, 3,  Amount.valueOf(22.3, nm)));
		calibrant.addHKL(new HKL(0, 0, 4,  Amount.valueOf(16.75, nm)));
		calibrant.addHKL(new HKL(0, 0, 5,  Amount.valueOf(13.4, nm)));
		calibrant.addHKL(new HKL(0, 0, 6,  Amount.valueOf(11.6, nm)));
		calibrant.addHKL(new HKL(0, 0, 7,  Amount.valueOf(9.6,  nm)));
		calibrant.addHKL(new HKL(0, 0, 8,  Amount.valueOf(8.4,  nm)));
		calibrant.addHKL(new HKL(0, 0, 9,  Amount.valueOf(7.4,  nm)));
		calibrant.addHKL(new HKL(0, 0, 10, Amount.valueOf(6.7,  nm)));
		calibrant.addHKL(new HKL(0, 0, 11, Amount.valueOf(6.1,  nm)));
		calibrant.addHKL(new HKL(0, 0, 12, Amount.valueOf(5.6,  nm)));
		calibrant.addHKL(new HKL(0, 0, 13, Amount.valueOf(5.15, nm)));
		calibrant.addHKL(new HKL(0, 0, 15, Amount.valueOf(4.46, nm)));
		calibrant.addHKL(new HKL(0, 0, 20, Amount.valueOf(3.35, nm)));
		calibrant.addHKL(new HKL(0, 0, 21, Amount.valueOf(3.2,  nm)));
		calibrant.addHKL(new HKL(0, 0, 22, Amount.valueOf(3.05, nm)));
		calibrant.addHKL(new HKL(0, 0, 30, Amount.valueOf(2.2,  nm)));
		calibrant.addHKL(new HKL(0, 0, 35, Amount.valueOf(1.9,  nm)));
		calibrant.addHKL(new HKL(0, 0, 41, Amount.valueOf(1.6,  nm)));
		calibrant.addHKL(new HKL(0, 0, 52, Amount.valueOf(1.3,  nm)));
		calibrant.addHKL(new HKL(0, 0, 71, Amount.valueOf(0.95, nm)));
		calibrants.put(calibrant.getName(), calibrant);
		
		
		calibrant = new CalibrantSpacing("Collagen Dry"); 
		calibrant.addHKL(new HKL(0, 0, 1,  Amount.valueOf(65.3, nm)));
		calibrant.addHKL(new HKL(0, 0, 2,  Amount.valueOf(32.7, nm)));
		calibrant.addHKL(new HKL(0, 0, 3,  Amount.valueOf(21.8, nm)));
		calibrant.addHKL(new HKL(0, 0, 4,  Amount.valueOf(16.3, nm)));
		calibrant.addHKL(new HKL(0, 0, 5,  Amount.valueOf(13.1, nm)));
		calibrant.addHKL(new HKL(0, 0, 6,  Amount.valueOf(10.9, nm)));
		calibrant.addHKL(new HKL(0, 0, 7,  Amount.valueOf(9.33, nm)));
		calibrant.addHKL(new HKL(0, 0, 8,  Amount.valueOf(8.16, nm)));
		calibrant.addHKL(new HKL(0, 0, 9,  Amount.valueOf(7.26, nm)));
		calibrant.addHKL(new HKL(0, 0, 10, Amount.valueOf(6.53, nm)));
		calibrant.addHKL(new HKL(0, 0, 11, Amount.valueOf(5.94, nm)));
		calibrant.addHKL(new HKL(0, 0, 12, Amount.valueOf(5.44, nm)));
		calibrant.addHKL(new HKL(0, 0, 13, Amount.valueOf(5.02, nm)));
		calibrant.addHKL(new HKL(0, 0, 14, Amount.valueOf(4.66, nm)));
		calibrants.put(calibrant.getName(), calibrant);

		
		calibrant = new CalibrantSpacing("Ag Behenate"); // Huang, Toraya, Blanton & Wu, 1993 (58.380)
		calibrant.addHKL(new HKL(0, 0, 1,  Amount.valueOf(5.8380,  nm))); 
		calibrant.addHKL(new HKL(0, 0, 2,  Amount.valueOf(2.9190,  nm)));
		calibrant.addHKL(new HKL(0, 0, 3,  Amount.valueOf(1.9460,  nm)));
		calibrant.addHKL(new HKL(0, 0, 4,  Amount.valueOf(1.4595,  nm)));
		calibrant.addHKL(new HKL(0, 0, 5,  Amount.valueOf(1.1676,  nm)));
		calibrant.addHKL(new HKL(0, 0, 6,  Amount.valueOf(0.97300, nm)));
		calibrant.addHKL(new HKL(0, 0, 7,  Amount.valueOf(0.83400, nm)));
		calibrant.addHKL(new HKL(0, 0, 8,  Amount.valueOf(0.72975, nm)));
		calibrant.addHKL(new HKL(0, 0, 9,  Amount.valueOf(0.64867, nm)));
		calibrant.addHKL(new HKL(0, 0, 10, Amount.valueOf(0.58380, nm)));
		calibrant.addHKL(new HKL(0, 0, 11, Amount.valueOf(0.53073, nm)));
		calibrant.addHKL(new HKL(0, 0, 12, Amount.valueOf(0.48650, nm)));
		calibrant.addHKL(new HKL(0, 0, 13, Amount.valueOf(0.44908, nm)));
		calibrant.addHKL(new HKL(0, 0, 14, Amount.valueOf(0.417, nm)));
		//doublet from gisax.com
		calibrant.addHKL(new HKL(Amount.valueOf(0.458996, nm)));
		calibrant.addHKL(new HKL(Amount.valueOf(0.45300, nm)));
		calibrants.put(calibrant.getName(), calibrant);
		        
		
		calibrant = new CalibrantSpacing("HDPE"); 
		calibrant.addHKL(new HKL(1, 1, 0, Amount.valueOf(0.4166, nm)));
		calibrant.addHKL(new HKL(2, 0, 0, Amount.valueOf(0.378 , nm)));
		calibrant.addHKL(new HKL(2, 1, 0, Amount.valueOf(0.3014, nm)));
		calibrant.addHKL(new HKL(0, 2, 0, Amount.valueOf(0.249 , nm)));
		calibrants.put(calibrant.getName(), calibrant);
		
		
		calibrant = new CalibrantSpacing("Silicon"); // 2010 CODATA (5.4310205, Diamond FCC)
		calibrant.addHKL(new HKL(1, 1, 1, Amount.valueOf(3.1356011,  angstrom)));
		calibrant.addHKL(new HKL(2, 2, 0, Amount.valueOf(1.9201557,  angstrom)));
		calibrant.addHKL(new HKL(3, 1, 1, Amount.valueOf(1.6375143,  angstrom)));
		calibrant.addHKL(new HKL(4, 0, 0, Amount.valueOf(1.3577551,  angstrom)));
		calibrant.addHKL(new HKL(3, 3, 1, Amount.valueOf(1.2459616,  angstrom)));
		calibrant.addHKL(new HKL(4, 2, 2, Amount.valueOf(1.1086024,  angstrom)));
		calibrant.addHKL(new HKL(3, 3, 3, Amount.valueOf(1.0452004,  angstrom))); // 511
		calibrant.addHKL(new HKL(4, 4, 0, Amount.valueOf(0.96007786, angstrom)));
		calibrant.addHKL(new HKL(5, 3, 1, Amount.valueOf(0.91801002, angstrom)));
		calibrant.addHKL(new HKL(6, 2, 0, Amount.valueOf(0.85871974, angstrom)));
		calibrant.addHKL(new HKL(5, 3, 3, Amount.valueOf(0.82822286, angstrom)));
		calibrant.addHKL(new HKL(4, 4, 4, Amount.valueOf(0.78390029, angstrom)));
		calibrant.addHKL(new HKL(5, 5, 1, Amount.valueOf(0.76049498, angstrom))); // 711
		calibrant.addHKL(new HKL(6, 4, 2, Amount.valueOf(0.72575064, angstrom)));
		calibrant.addHKL(new HKL(5, 5, 3, Amount.valueOf(0.70705864, angstrom))); // 731
		calibrant.addHKL(new HKL(8, 0, 0, Amount.valueOf(0.67887756, angstrom)));
		calibrant.addHKL(new HKL(7, 3, 3, Amount.valueOf(0.66350476, angstrom)));
		calibrant.addHKL(new HKL(5, 5, 5, Amount.valueOf(0.62712023, angstrom))); // 751
		calibrant.addHKL(new HKL(8, 4, 0, Amount.valueOf(0.60720655, angstrom)));
		calibrants.put(calibrant.getName(), calibrant);

		calibrant = new CalibrantSpacing("Cr2O3"); // NIST SRM 674 (4.95916(12), 13.5972(6),
		// trigonal - hexagonal scalenohedral; IUCR space group #166)
		calibrant.addHKL(new HKL(Amount.valueOf(3.645, angstrom)));
		calibrant.addHKL(new HKL(Amount.valueOf(2.672, angstrom)));
		calibrant.addHKL(new HKL(Amount.valueOf(2.487, angstrom)));
		calibrant.addHKL(new HKL(Amount.valueOf(2.181, angstrom)));
		calibrant.addHKL(new HKL(Amount.valueOf(1.819, angstrom)));
		calibrant.addHKL(new HKL(Amount.valueOf(1.676, angstrom)));
		calibrant.addHKL(new HKL(Amount.valueOf(1.467, angstrom)));
		calibrant.addHKL(new HKL(Amount.valueOf(1.433, angstrom)));
		calibrants.put(calibrant.getName(), calibrant);
		
		calibrant = new CalibrantSpacing("CeO2"); // NIST SRM 674 (5.41129, FCC)
		calibrant.addHKL(new HKL(1, 1, 1,  Amount.valueOf(3.12421,  angstrom)));
		calibrant.addHKL(new HKL(2, 0, 0,  Amount.valueOf(2.70565,  angstrom)));
		calibrant.addHKL(new HKL(2, 2, 0,  Amount.valueOf(1.91318,  angstrom)));
		calibrant.addHKL(new HKL(3, 1, 1,  Amount.valueOf(1.63157,  angstrom)));
		calibrant.addHKL(new HKL(2, 2, 2,  Amount.valueOf(1.56210,  angstrom)));
		calibrant.addHKL(new HKL(4, 0, 0,  Amount.valueOf(1.35282,  angstrom)));
		calibrant.addHKL(new HKL(3, 3, 1,  Amount.valueOf(1.24144,  angstrom)));
		calibrant.addHKL(new HKL(4, 2, 0,  Amount.valueOf(1.21000,  angstrom)));
		calibrant.addHKL(new HKL(4, 2, 2,  Amount.valueOf(1.10457,  angstrom)));
		calibrant.addHKL(new HKL(3, 3, 3,  Amount.valueOf(1.04140,  angstrom))); // 511
		calibrant.addHKL(new HKL(4, 4, 0,  Amount.valueOf(0.956590, angstrom)));
		calibrant.addHKL(new HKL(5, 3, 1,  Amount.valueOf(0.914675, angstrom)));
		calibrant.addHKL(new HKL(4, 4, 2,  Amount.valueOf(0.901882, angstrom))); // 600
		calibrant.addHKL(new HKL(6, 2, 0,  Amount.valueOf(0.855600, angstrom)));
		calibrant.addHKL(new HKL(5, 3, 3,  Amount.valueOf(0.825214, angstrom)));
		calibrant.addHKL(new HKL(6, 2, 2,  Amount.valueOf(0.815783, angstrom)));
		calibrant.addHKL(new HKL(5, 5, 1,  Amount.valueOf(0.757732, angstrom))); // 711
		calibrant.addHKL(new HKL(6, 4, 0,  Amount.valueOf(0.750411, angstrom)));
		calibrant.addHKL(new HKL(6, 4, 2,  Amount.valueOf(0.723114, angstrom)));
		calibrant.addHKL(new HKL(5, 5, 3,  Amount.valueOf(0.704490, angstrom))); // 731
		calibrant.addHKL(new HKL(8, 0, 0,  Amount.valueOf(0.676411, angstrom)));
		calibrant.addHKL(new HKL(7, 3, 3,  Amount.valueOf(0.661094, angstrom)));
		calibrant.addHKL(new HKL(6, 4, 4,  Amount.valueOf(0.656215, angstrom))); // 820
		calibrant.addHKL(new HKL(6, 6, 0,  Amount.valueOf(0.637727, angstrom))); // 822
		calibrant.addHKL(new HKL(7, 5, 1,  Amount.valueOf(0.624842, angstrom)));
		calibrant.addHKL(new HKL(6, 6, 2,  Amount.valueOf(0.620718, angstrom)));
		calibrants.put(calibrant.getName(), calibrant);

		calibrant = new CalibrantSpacing("Bees Wax"); 
		calibrant.addHKL(new HKL(Amount.valueOf(3.6, angstrom)));
		calibrant.addHKL(new HKL(Amount.valueOf(2.4, angstrom)));
		calibrants.put(calibrant.getName(), calibrant);
		
		calibrant = new CalibrantSpacing("LaB6"); // NIST SRM 660a (4.1569162, Cubic)
		calibrant.addHKL(new HKL(1, 0, 0,  Amount.valueOf(4.156916,  angstrom)));
		calibrant.addHKL(new HKL(1, 1, 0,  Amount.valueOf(2.939383,  angstrom)));
		calibrant.addHKL(new HKL(1, 1, 1,  Amount.valueOf(2.399996,  angstrom)));
		calibrant.addHKL(new HKL(2, 0, 0,  Amount.valueOf(2.078458,  angstrom)));
		calibrant.addHKL(new HKL(2, 1, 0,  Amount.valueOf(1.859029,  angstrom)));
		calibrant.addHKL(new HKL(2, 1, 1,  Amount.valueOf(1.697053,  angstrom)));
		calibrant.addHKL(new HKL(2, 2, 0,  Amount.valueOf(1.469691,  angstrom)));
		calibrant.addHKL(new HKL(3, 0, 0,  Amount.valueOf(1.385638,  angstrom)));
		calibrant.addHKL(new HKL(3, 1, 0,  Amount.valueOf(1.314532,  angstrom)));
		calibrant.addHKL(new HKL(3, 1, 1,  Amount.valueOf(1.253357,  angstrom)));
		calibrant.addHKL(new HKL(2, 2, 2,  Amount.valueOf(1.199998,  angstrom)));
		calibrant.addHKL(new HKL(3, 2, 0,  Amount.valueOf(1.152921,  angstrom)));
		calibrant.addHKL(new HKL(3, 2, 1,  Amount.valueOf(1.110982,  angstrom)));
		calibrant.addHKL(new HKL(4, 0, 0,  Amount.valueOf(1.039229,  angstrom)));
		calibrant.addHKL(new HKL(4, 1, 0,  Amount.valueOf(1.008200,  angstrom)));
		calibrant.addHKL(new HKL(3, 3, 0,  Amount.valueOf(0.979794,  angstrom)));
		calibrant.addHKL(new HKL(3, 3, 1,  Amount.valueOf(0.953661,  angstrom)));
		calibrant.addHKL(new HKL(4, 2, 0,  Amount.valueOf(0.929514,  angstrom)));
		calibrant.addHKL(new HKL(4, 2, 1,  Amount.valueOf(0.907113,  angstrom)));
		calibrant.addHKL(new HKL(3, 3, 2,  Amount.valueOf(0.886257,  angstrom)));
		calibrant.addHKL(new HKL(4, 2, 2,  Amount.valueOf(0.848526,  angstrom)));
		calibrant.addHKL(new HKL(4, 2, 2,  Amount.valueOf(0.848526,  angstrom)));
		calibrant.addHKL(new HKL(5, 0, 0,  Amount.valueOf(0.831383,  angstrom)));
		calibrant.addHKL(new HKL(5, 0, 0,  Amount.valueOf(0.815238,  angstrom)));
		calibrant.addHKL(new HKL(5, 1, 1,  Amount.valueOf(0.799998,  angstrom)));
		
		calibrants.put(calibrant.getName(), calibrant);

		return calibrants;
	}
	
}
