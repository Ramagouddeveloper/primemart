package com.primemart.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private double total;

    private String paymentMethod;

    private String status;

    /*
     * Kept for backward compatibility with existing code.
     * This represents the delivery location.
     */
    private Long locationId;

    /*
     * Location whose products the user selected.
     */
    private Long productLocationId;

    /*
     * Location/address where the customer wants delivery.
     */
    private Long deliveryLocationId;

    private Long adminId;


    // =========================
    // GETTERS AND SETTERS
    // =========================

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

    /*
     * Existing locationId.
     * Treat this as delivery location.
     */
    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public Long getProductLocationId() {
        return productLocationId;
    }

    public void setProductLocationId(Long productLocationId) {
        this.productLocationId = productLocationId;
    }

    public Long getDeliveryLocationId() {
        return deliveryLocationId;
    }

    public void setDeliveryLocationId(Long deliveryLocationId) {
        this.deliveryLocationId = deliveryLocationId;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }


    public Order() {
    }


    public Order(Long id,
                 String username,
                 double total,
                 String paymentMethod,
                 String status,
                 Long locationId) {

        this.id = id;
        this.username = username;
        this.total = total;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.locationId = locationId;
    }


    @Override
    public String toString() {
        return "Order [id=" + id
                + ", username=" + username
                + ", total=" + total
                + ", paymentMethod=" + paymentMethod
                + ", status=" + status
                + ", locationId=" + locationId
                + ", productLocationId=" + productLocationId
                + ", deliveryLocationId=" + deliveryLocationId
                + ", adminId=" + adminId
                + "]";
    }
}