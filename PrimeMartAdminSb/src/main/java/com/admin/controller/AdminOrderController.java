package com.admin.controller;


import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.admin.entity.Order;
import com.admin.entity.OrderItem;
import com.admin.repository.OrderItemRepository;
import com.admin.repository.OrderRepository;

@RestController
@RequestMapping("/admin/orders")
public class AdminOrderController {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;

    public AdminOrderController(OrderRepository orderRepo,
                                OrderItemRepository orderItemRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
    }

   
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

   
    @GetMapping("/{orderId}/items")
    public List<OrderItem> getOrderItems(@PathVariable Long orderId) {
        return orderItemRepo.findByOrderId(orderId);
    }

    
    @PutMapping("/{orderId}/status")
    public Map<String, String> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> req) {

        String status = req.get("status");

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        orderRepo.save(order);

        return Map.of("message", "Order updated to " + status);
    }

  
    @PutMapping("/{orderId}/accept")
    public Map<String, String> acceptOrder(@PathVariable Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus("ACCEPTED");
        orderRepo.save(order);

        return Map.of("message", "Order Accepted");
    }

    @GetMapping("/count")
    public long getTotalOrders() {
        return orderRepo.count();
    }

   
    @GetMapping("/revenue")
    public double getTotalRevenue() {
        return orderRepo.findAll()
                .stream()
                .mapToDouble(Order::getTotal)
                .sum();
    }
    
    
 
 @PutMapping("/{orderId}/ship")
 public Map<String, String> shipOrder(@PathVariable Long orderId) {

     Order order = orderRepo.findById(orderId)
             .orElseThrow(() -> new RuntimeException("Order not found"));

     order.setStatus("SHIPPED");
     orderRepo.save(order);

     return Map.of("message", "Order shipped");
 }
 
 
@PutMapping("/{orderId}/out")
public Map<String, String> outForDelivery(@PathVariable Long orderId) {

  Order order = orderRepo.findById(orderId)
          .orElseThrow(() -> new RuntimeException("Order not found"));

  order.setStatus("OUT_FOR_DELIVERY");
  orderRepo.save(order);

  return Map.of("message", "Out for delivery");
}

@PutMapping("/{orderId}/deliver")
public Map<String, String> deliverOrder(@PathVariable Long orderId) {

  Order order = orderRepo.findById(orderId)
          .orElseThrow(() -> new RuntimeException("Order not found"));

  order.setStatus("DELIVERED");
  orderRepo.save(order);

  return Map.of("message", "Delivered");
}
    
}