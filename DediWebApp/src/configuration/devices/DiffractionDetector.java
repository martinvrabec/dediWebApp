/*
 * Copyright (c) 2012 Diamond Light Source Ltd.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */
package configuration.devices;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.measure.quantity.Length;
import javax.measure.unit.SI;

import org.jscience.physics.amount.Amount;

public class DiffractionDetector implements Serializable {

	private static final long serialVersionUID = -1133345866155946034L;
	
	private String detectorName;
	private Amount<Length> xPixelSize;
	private Amount<Length> yPixelSize;
	private int numberOfPixelsX;
	private int numberOfPixelsY;
	private int numberOfHorizontalModules;
	private int numberOfVerticalModules;
	private int xGap; // in pixels
	private int yGap; // in pixels
	private List<Integer> missingModules;
	
	
	public DiffractionDetector() {
		missingModules = new ArrayList<>();
	}
	
	
	/**
	 * Copy constructor. Creates a deep copy of the given detector.
	 * @throws NullPointerException if the given detector is null.
	 */
	public DiffractionDetector(DiffractionDetector detector){
		if(detector == null) throw new NullPointerException();
		detectorName = detector.getDetectorName();
		xPixelSize = (detector.getxPixelSize() == null) ? null : detector.getxPixelSize().copy();
		yPixelSize = (detector.getyPixelSize() == null) ? null : detector.getyPixelSize().copy();
		numberOfPixelsX = detector.getNumberOfPixelsX();
		numberOfPixelsY = detector.getNumberOfPixelsY();
		numberOfHorizontalModules = detector.getNumberOfHorizontalModules();
		numberOfVerticalModules = detector.getNumberOfVerticalModules();
		xGap = detector.getXGap();
		yGap = detector.getYGap();
		// This creates only a shallow copy of the List, but the elements are Integers, hence immutable, so it shouldn't matter.
		missingModules = (detector.getMissingModules() == null) ? null : new ArrayList<>(detector.getMissingModules()); 
	}
	
	
	public int getNumberOfHorizontalModules(){
		return numberOfHorizontalModules;
	}
	
	public void setNumberOfHorizontalModules(int numberOfHorizontalModules){
		this.numberOfHorizontalModules = numberOfHorizontalModules;
	}
	
	
	public int getNumberOfVerticalModules() {
		return numberOfVerticalModules;
	}

	public void setNumberOfVerticalModules(int numberOfVerticalModules) {
		this.numberOfVerticalModules = numberOfVerticalModules;
	}

	
	public int getXGap() {
		return xGap;
	}

	public void setXGap(int xGap) {
		this.xGap = xGap;
	}
	
	public int getYGap() {
		return yGap;
	}
	
	public void setYGap(int yGap) {
		this.yGap = yGap;
	}

	public int getNumberOfPixelsX() {
		return numberOfPixelsX;
	}
	public void setNumberOfPixelsX(int numberOfPixelsX) {
		this.numberOfPixelsX = numberOfPixelsX;
	}
	public int getNumberOfPixelsY() {
		return numberOfPixelsY;
	}
	public void setNumberOfPixelsY(int numberOfPixelsY) {
		this.numberOfPixelsY = numberOfPixelsY;
	}

	private String units;
	
	public String getDetectorName() {
		return detectorName;
	}
	public void setDetectorName(String name) {
		this.detectorName = name;
	}
	public Amount<Length> getxPixelSize() {
		return xPixelSize;
	}
	public void setxPixelSize(Amount<Length> xPixelSize) {
		this.xPixelSize = xPixelSize;
	}
	
	public Amount<Length> getyPixelSize() {
		return yPixelSize;
	}
	public void setyPixelSize(Amount<Length> yPixelSize) {
		this.yPixelSize = yPixelSize;
	}
	
	public double getXPixelMM() {
		if (xPixelSize ==  null) return Double.NaN;
		return xPixelSize.doubleValue(SI.MILLIMETRE);
	}
	
	public void setXPixelMM(double pixmm) {
		xPixelSize = Amount.valueOf(pixmm, SI.MILLIMETRE);
	}
	
	public double getYPixelMM() {
		if (yPixelSize ==  null) return Double.NaN;
		return yPixelSize.doubleValue(SI.MILLIMETRE);
	}
	
	public void setYPixelMM(double pixmm) {
		yPixelSize = Amount.valueOf(pixmm, SI.MILLIMETRE);
	}
	
	
	public List<Integer> getMissingModules(){
		return missingModules;
	}
	
	
	public void setMissingModules(List<Integer> missingModules){
		this.missingModules = missingModules;
	}
	
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((detectorName == null) ? 0 : detectorName.hashCode());
		result = prime * result + numberOfPixelsX;
		result = prime * result + numberOfPixelsY;
		result = prime * result + numberOfHorizontalModules;
		result = prime * result + numberOfVerticalModules;
		result = prime * result + xGap;
		result = prime * result + yGap;
		result = prime * result + ((units == null) ? 0 : units.hashCode());
		result = prime * result
				+ ((xPixelSize == null) ? 0 : xPixelSize.hashCode());
		result = prime * result
				+ ((yPixelSize == null) ? 0 : yPixelSize.hashCode());
		result = prime * result
				+ ((missingModules == null) ? 0 : missingModules.hashCode());
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
		DiffractionDetector other = (DiffractionDetector) obj;
		if (detectorName == null) {
			if (other.detectorName != null)
				return false;
		} else if (!detectorName.equals(other.detectorName))
			return false;
		if (numberOfPixelsX != other.numberOfPixelsX)
			return false;
		if (numberOfPixelsY != other.numberOfPixelsY)
			return false;
		if (numberOfHorizontalModules != other.numberOfHorizontalModules)
			return false;
		if (numberOfVerticalModules != other.numberOfVerticalModules)
			return false;
		if (xGap != other.xGap)
			return false;
		if (yGap != other.yGap)
			return false;
		if (units == null) {
			if (other.units != null)
				return false;
		} else if (!units.equals(other.units))
			return false;
		if (xPixelSize == null) {
			if (other.xPixelSize != null)
				return false;
		} else if (!xPixelSize.equals(other.xPixelSize))
			return false;
		if (yPixelSize == null) {
			if (other.yPixelSize != null)
				return false;
		} else if (!yPixelSize.equals(other.yPixelSize))
			return false;
		if (missingModules == null) {
			if (other.missingModules != null)
				return false;
		} else if (!missingModules.equals(other.missingModules))
			return false;
		return true;
	}
	
	
	@Override
	public String toString(){
		return detectorName;
	}
}
