package com.primemart.payment;

import java.util.Map;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    @Value("${razorpay.key.id}") private String keyId;
    @Value("${razorpay.key.secret}") private String keySecret;
    private final PaymentOrderService orderService;
    public PaymentController(PaymentOrderService orderService) { this.orderService = orderService; }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String,Object> request) {
        try {
            double rupees = Double.parseDouble(String.valueOf(request.get("amount")));
            if (rupees <= 0) return ResponseEntity.badRequest().body(Map.of("message","Amount must be greater than zero"));
            int paise = (int)Math.round(rupees * 100);
            JSONObject body = new JSONObject();
            body.put("amount", paise); body.put("currency", "INR");
            body.put("receipt", String.valueOf(request.getOrDefault("receipt", "PM-" + System.currentTimeMillis())));
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            com.razorpay.Order order = client.orders.create(body);
            return ResponseEntity.ok(Map.of("keyId", keyId, "razorpayOrderId", order.get("id"), "amount", paise, "currency", "INR"));
        } catch (RazorpayException | RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Unable to create payment order", "detail", ex.getMessage() == null ? "" : ex.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String,Object> request) {
        String mode = String.valueOf(request.getOrDefault("mode", "ONLINE"));
        try {
            @SuppressWarnings("unchecked") Map<String,Object> order = (Map<String,Object>) request.get("order");
            if (order == null) return ResponseEntity.badRequest().body(Map.of("message","Order details are required"));
            if ("COD".equalsIgnoreCase(mode)) return ResponseEntity.ok(orderService.placeOrder(order, "COD", null, null));
            String razorpayOrderId = String.valueOf(request.get("razorpayOrderId"));
            String razorpayPaymentId = String.valueOf(request.get("razorpayPaymentId"));
            String signature = String.valueOf(request.get("razorpaySignature"));
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", signature);
            if (!Utils.verifyPaymentSignature(attributes, keySecret)) {
                return ResponseEntity.badRequest().body(Map.of("message","Payment signature verification failed"));
            }
            return ResponseEntity.ok(orderService.placeOrder(order, "ONLINE", razorpayOrderId, razorpayPaymentId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage() == null ? "Payment verification failed" : ex.getMessage()));
        }
    }
}
