package com.primemart.controller;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import com.primemart.entity.Order;
import com.primemart.entity.OrderItem;
import com.primemart.entity.Product;
import com.primemart.repository.OrderRepository;
import com.primemart.repository.OrderItemRepository;
import com.primemart.repository.ProductRepository;
import com.primemart.payment.PaymentOrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {
	private final OrderRepository orderRepo;
	private final OrderItemRepository itemRepo;
	private final ProductRepository productRepo;
	private final PaymentOrderService orderService;

	public OrderController(OrderRepository o, OrderItemRepository i, ProductRepository p, PaymentOrderService s) {
		orderRepo = o;
		itemRepo = i;
		productRepo = p;
		orderService = s;
	}

	@PostMapping
	public Order placeOrder(@RequestBody Map<String, Object> req) {
		return orderService.placeOrder(req, String.valueOf(req.getOrDefault("paymentMethod", "COD")), null, null);
	}

	@GetMapping
	public List<Order> getAllOrders() {
		return orderRepo.findAll();
	}

	@GetMapping("/user/{username}")
	public List<Order> getOrdersByUser(@PathVariable String username) {
		return orderRepo.findByUsername(username);
	}

	@GetMapping("/{orderId}/items")
	public List<Map<String, Object>> getOrderItems(@PathVariable Long orderId) {
		return itemRepo.findByOrderId(orderId).stream().map(i -> {
			Product p = productRepo.findById(i.getProductId()).orElse(null);
			return Map.of("id", i.getId(), "quantity", i.getQuantity(), "price", i.getPrice(), "product", p);
		}).toList();
	}

	@PutMapping("/{orderId}/cancel")
	public Map<String, String> cancelOrder(@PathVariable Long orderId) {
		Order o = orderRepo.findById(orderId).orElseThrow();
		if ("PENDING".equals(o.getStatus()) || "ACCEPTED".equals(o.getStatus())) {
			o.setStatus("CANCELLED");
			orderRepo.save(o);
			return Map.of("message", "Order cancelled successfully");
		}
		return Map.of("message", "Cannot cancel after shipping");
	}

}
