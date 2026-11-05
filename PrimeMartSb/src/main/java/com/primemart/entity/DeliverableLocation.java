package com.primemart.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "deliverable_locations")
public class DeliverableLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String city;

    private String area;
    private String landmark;

    @Column(name = "full_address")
    private String fullAddress;

    private String state;

    @Column(nullable = false)
    private String pincode;

    private boolean active = true;

    public DeliverableLocation() {}

    // ===== Getters =====

    public Long getId() { return id; }
    public String getCity() { return city; }
    public String getArea() { return area; }
    public String getLandmark() { return landmark; }
    public String getFullAddress() { return fullAddress; }
    public String getState() { return state; }
    public String getPincode() { return pincode; }
    public boolean isActive() { return active; }

    // ===== Setters =====

    public void setId(Long id) { this.id = id; }
    public void setCity(String city) { this.city = city; }
    public void setArea(String area) { this.area = area; }
    public void setLandmark(String landmark) { this.landmark = landmark; }
    public void setFullAddress(String fullAddress) { this.fullAddress = fullAddress; }
    public void setState(String state) { this.state = state; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public void setActive(boolean active) { this.active = active; }
}