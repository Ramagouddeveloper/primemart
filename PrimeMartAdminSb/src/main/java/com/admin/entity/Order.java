package com.admin.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "orders") // ✅ FIX

public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private double total;
    private String paymentMethod;
    private String status;

    private Long locationId;

    private Long adminId;
	public Long getAdminId() {
		return adminId;
	}

	public void setAdminId(Long adminId) {
		this.adminId = adminId;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getLocationId() {
		return locationId;
	}

	public void setLocationId(Long locationId) {
		this.locationId = locationId;
	}

	public Order(Long id, String username, double total, String paymentMethod, String status, Long locationId) {
		super();
		this.id = id;
		this.username = username;
		this.total = total;
		this.paymentMethod = paymentMethod;
		this.status = status;
		this.locationId = locationId;
	}

	public Order() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "Order [id=" + id + ", username=" + username + ", total=" + total + ", paymentMethod=" + paymentMethod
				+ ", status=" + status + ", locationId=" + locationId + "]";
	}

   
}
