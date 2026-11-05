package com.primemart.entity;
import jakarta.persistence.*;
@Entity @Table(name="payments", indexes={@Index(name="idx_payment_order", columnList="order_id"), @Index(name="idx_payment_gateway", columnList="gateway_payment_id")})
public class Payment {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="order_id", nullable=false) private Long orderId;
 private String method; private String status; private double amount;
 @Column(name="gateway_order_id") private String gatewayOrderId;
 @Column(name="gateway_payment_id") private String gatewayPaymentId;
 public Long getId(){return id;} public void setId(Long v){id=v;} public Long getOrderId(){return orderId;} public void setOrderId(Long v){orderId=v;}
 public String getMethod(){return method;} public void setMethod(String v){method=v;} public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public double getAmount(){return amount;} public void setAmount(double v){amount=v;} public String getGatewayOrderId(){return gatewayOrderId;} public void setGatewayOrderId(String v){gatewayOrderId=v;}
 public String getGatewayPaymentId(){return gatewayPaymentId;} public void setGatewayPaymentId(String v){gatewayPaymentId=v;}
}
