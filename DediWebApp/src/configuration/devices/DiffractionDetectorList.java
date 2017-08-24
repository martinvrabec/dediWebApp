package configuration.devices;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class DiffractionDetectorList implements Serializable {
	private static final long serialVersionUID = 7297838000309018668L;
	
	private List<DiffractionDetector> diffractionDetectors;
	
	public List<DiffractionDetector> getDiffractionDetectors() {
		return diffractionDetectors;
	}

	public DiffractionDetectorList() {
		diffractionDetectors = new ArrayList<DiffractionDetector>();
	}
	
	public void setDiffractionDetectors(
			List<DiffractionDetector> diffractionDetectors) {
		this.diffractionDetectors = diffractionDetectors;
	}

	
	public void addDiffractionDetector(DiffractionDetector detector) {
		diffractionDetectors.add(detector);
	}
	
	public void removeDiffractionDetector(DiffractionDetector detector) {
		diffractionDetectors.remove(detector);
	}
	

	public void clear() {
		if (diffractionDetectors!=null) diffractionDetectors.clear();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime
				* result
				+ ((diffractionDetectors == null) ? 0 : diffractionDetectors
						.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		DiffractionDetectorList other = (DiffractionDetectorList) obj;
		if (diffractionDetectors == null) {
			if (other.diffractionDetectors != null)
				return false;
		} else if (!diffractionDetectors.equals(other.diffractionDetectors))
			return false;
		return true;
	}
}
