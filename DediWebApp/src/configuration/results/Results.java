package configuration.results;

import javax.vecmath.Vector2d;

import configuration.calculations.NumericRange;

public class Results {
	private NumericRange visibleRange;
	private NumericRange fullRange;
	private NumericRange requestedRange;
	
	private Vector2d visibleRangeStartPoint;
	private Vector2d visibleRangeEndPoint;
	private Vector2d requestedRangeStartPoint;
	private Vector2d requestedRangeEndPoint;
	
	
	// Getters
	public NumericRange getVisibleRange() {
		return visibleRange;
	}


	public NumericRange getFullRange() {
		return fullRange;
	}


	public NumericRange getRequestedRange() {
		return requestedRange;
	}
	
	
	public Vector2d getVisibleRangeStartPoint() {
		return visibleRangeStartPoint;
	}


	public Vector2d getVisibleRangeEndPoint() {
		return visibleRangeEndPoint;
	}


	public Vector2d getRequestedRangeStartPoint() {
		return requestedRangeStartPoint;
	}


	public Vector2d getRequestedRangeEndPoint() {
		return requestedRangeEndPoint;
	}


	public boolean getIsSatisfied() {
		return  visibleRange != null && requestedRange != null &&
				visibleRange.contains(requestedRange);
	}


	public boolean getHasSolution(){
		return (visibleRange != null);
	}


	// Setters
	public void setVisibleRange(NumericRange range){
		visibleRange = range;
	}
	
	
	public void setVisibleRange(NumericRange range, Vector2d startPt, Vector2d endPt){
		visibleRange = range;
		visibleRangeStartPoint = startPt;
		visibleRangeEndPoint = endPt;
	}
	
	
	public void setVisibleRangeStartPoint(Vector2d startPt) {
		visibleRangeStartPoint = startPt;
	}
	
	
	public void setVisibleRangeEndPoint(Vector2d endPt) {
		visibleRangeEndPoint = endPt;
	}
	
	
	public void setFullRange(NumericRange range){
		fullRange = range;
	}
	
	
	public void setRequestedRange(NumericRange range, Vector2d startPt, Vector2d endPt){
		requestedRange = range;
		requestedRangeStartPoint = startPt;
		requestedRangeEndPoint = endPt;
	}
	
	
	public void setRequestedRangeStartPoint(Vector2d startPt) {
		requestedRangeStartPoint = startPt;
	}
	
	
	public void setRequestedRangeEndPoint(Vector2d endPt) {
		requestedRangeEndPoint = endPt;
	}
}
