package com.primemart.dto;


public class DeliverableLocationDTO {

    private String city;
    private String area;
    private String landmark;
    private String fullAddress;
    private String state;
    private String pincode;
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getArea() {
		return area;
	}
	public void setArea(String area) {
		this.area = area;
	}
	public String getLandmark() {
		return landmark;
	}
	public void setLandmark(String landmark) {
		this.landmark = landmark;
	}
	public String getFullAddress() {
		return fullAddress;
	}
	public void setFullAddress(String fullAddress) {
		this.fullAddress = fullAddress;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getPincode() {
		return pincode;
	}
	public void setPincode(String pincode) {
		this.pincode = pincode;
	}
	@Override
	public String toString() {
		return "DeliverableLocationDTO [city=" + city + ", area=" + area + ", landmark=" + landmark + ", fullAddress="
				+ fullAddress + ", state=" + state + ", pincode=" + pincode + "]";
	}
	public DeliverableLocationDTO(String city, String area, String landmark, String fullAddress, String state,
			String pincode) {
		super();
		this.city = city;
		this.area = area;
		this.landmark = landmark;
		this.fullAddress = fullAddress;
		this.state = state;
		this.pincode = pincode;
	}
	public DeliverableLocationDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    

}